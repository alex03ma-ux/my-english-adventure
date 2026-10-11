
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "No se encontró la clave de seguridad JWT.");
}

var signingKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateIssuer = true,
                ValidIssuer = "MyEnglishAdventure.Api",
                ValidateAudience = true,
                ValidAudience = "MyEnglishAdventure.Mobile",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<MyEnglishAdventure.Api.Services.PasswordService>();
builder.Services.AddScoped<MyEnglishAdventure.Api.Services.JwtTokenService>();


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();


app.MapGet("/api/health/database", async (IConfiguration configuration) =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem(
            "No se encontró la configuración de conexión.",
            statusCode: 500);
    }

    try
    {
        await using var connection =
            new MySqlConnector.MySqlConnection(connectionString);

        await connection.OpenAsync();

        return Results.Ok(new
        {
            estado = "Conexión exitosa",
            baseDeDatos = connection.Database
        });
    }
    catch
    {
        return Results.Problem(
            "No fue posible conectar con la base de datos.",
            statusCode: 503);
    }
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");


app.MapPost(
    "/api/students/register",
    async (
        MyEnglishAdventure.Api.Models.StudentRegistration request,
        MyEnglishAdventure.Api.Services.PasswordService passwordService,
        IConfiguration configuration) =>
    {
        var name = request.Name?.Trim();
        var email = request.Email?.Trim().ToLowerInvariant();
        var password = request.Password;

        if (string.IsNullOrWhiteSpace(name) ||
            name.Length < 2 || name.Length > 150)
        {
            return Results.BadRequest(new
            {
                mensaje = "El nombre debe tener entre 2 y 150 caracteres."
            });
        }

        if (string.IsNullOrWhiteSpace(email) ||
            !System.Net.Mail.MailAddress.TryCreate(email, out var address) ||
            address.Address != email ||
            email.Length > 255)
        {
            return Results.BadRequest(new
            {
                mensaje = "Ingresa un correo electrónico válido."
            });
        }

        if (string.IsNullOrEmpty(password) ||
            password.Length < 12 || password.Length > 128)
        {
            return Results.BadRequest(new
            {
                mensaje = "La contraseña debe tener entre 12 y 128 caracteres."
            });
        }

        var connectionString =
            configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return Results.Problem(
                "No se encontró la configuración de conexión.",
                statusCode: 500);
        }

        try
        {
            await using var connection =
                new MySqlConnector.MySqlConnection(connectionString);

            await connection.OpenAsync();

            await using (var check = connection.CreateCommand())
            {
                check.CommandText =
                    "SELECT COUNT(*) FROM students WHERE email = @email";
                check.Parameters.AddWithValue("@email", email);

                var count = Convert.ToInt64(await check.ExecuteScalarAsync());

                if (count > 0)
                {
                    return Results.Conflict(new
                    {
                        mensaje = "Ya existe una cuenta con ese correo."
                    });
                }
            }

            var passwordHash = passwordService.HashPassword(password);

            await using var command = connection.CreateCommand();
            command.CommandText = """
                INSERT INTO students (name, email, password_hash)
                VALUES (@name, @email, @passwordHash);
                """;

            command.Parameters.AddWithValue("@name", name);
            command.Parameters.AddWithValue("@email", email);
            command.Parameters.AddWithValue("@passwordHash", passwordHash);

            await command.ExecuteNonQueryAsync();

            return Results.Created("/api/students/register", new
            {
                mensaje = "Estudiante registrado correctamente.",
                nombre = name,
                correo = email
            });
        }
        catch (MySqlConnector.MySqlException ex) when (ex.Number == 1062)
        {
            return Results.Conflict(new
            {
                mensaje = "Ya existe una cuenta con ese correo."
            });
        }
        catch
        {
            return Results.Problem(
                "No fue posible completar el registro.",
                statusCode: 500);
        }
    });

app.MapGet("/api/verbs", async (IConfiguration configuration) =>
{
    var connectionString =
        configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem(
            "No se encontró la configuración de la base de datos.",
            statusCode: 500);
    }

    try
    {
        await using var connection =
            new MySqlConnector.MySqlConnection(connectionString);

        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, base_form, translation_es,
                   past_form, past_participle, pronunciation
            FROM verbs
            WHERE is_active = 1
            ORDER BY id;
            """;

        await using var reader = await command.ExecuteReaderAsync();

        var verbs = new List<object>();

        while (await reader.ReadAsync())
        {
            verbs.Add(new
            {
                id = reader.GetInt64(0),
                baseForm = reader.GetString(1),
                translationEs = reader.GetString(2),
                pastForm = reader.GetString(3),
                pastParticiple = reader.GetString(4),
                pronunciation = reader.IsDBNull(5)
                    ? null
                    : reader.GetString(5)
            });
        }

        return Results.Ok(verbs);
    }
    catch
    {
        return Results.Problem(
            "No fue posible consultar los verbos.",
            statusCode: 503);
    }
});


app.MapPost("/api/students/login", async (
   MyEnglishAdventure.Api.Models.StudentLogin request,
   MyEnglishAdventure.Api.Services.PasswordService passwordService,
   MyEnglishAdventure.Api.Services.JwtTokenService jwtTokenService,
   IConfiguration configuration) =>

{
    var email = request.Email?.Trim().ToLowerInvariant();

    if (string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new
        {
            mensaje = "Debes ingresar correo y contraseña."
        });
    }

    var connectionString =
        configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem(
            "No se encontró la configuración de conexión.",
            statusCode: 500);
    }

    try
    {
        await using var connection =
            new MySqlConnector.MySqlConnection(connectionString);

        await connection.OpenAsync();

        await using var command = connection.CreateCommand();

        command.CommandText = """
            SELECT id, name, email, password_hash
            FROM students
            WHERE email = @email
            LIMIT 1;
            """;

        command.Parameters.AddWithValue("@email", email);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return Results.Unauthorized();
        }

        var studentId = reader.GetInt64(0);
        var studentName = reader.GetString(1);
        var studentEmail = reader.GetString(2);
        var passwordHash = reader.GetString(3);

        if (!passwordService.VerifyPassword(
            passwordHash, request.Password))
        {
            return Results.Unauthorized();
        }

        
        var token = jwtTokenService.GenerateToken(
            studentId,
            studentEmail);

        
return Results.Ok(new
{
    mensaje = "Inicio de sesión exitoso.",
    token = token,
    expiresIn = 900,
    estudiante = new
    {
        id = studentId,
        nombre = studentName,
        correo = studentEmail
    }
});

    }
    catch
    {
        return Results.Problem(
            "No fue posible verificar las credenciales.",
            statusCode: 500);
    }
});


app.MapGet("/api/students/me", (
    System.Security.Claims.ClaimsPrincipal user) =>
{
    var studentId = user.FindFirst(
        System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    var email = user.FindFirst(
        System.Security.Claims.ClaimTypes.Email)?.Value;

    return Results.Ok(new
    {
        mensaje = "Acceso autorizado.",
        estudianteId = studentId,
        correo = email
    });
})
.RequireAuthorization();


app.MapGet("/api/students/progress", async (
    System.Security.Claims.ClaimsPrincipal user,
    IConfiguration configuration) =>
{
    var studentIdText = user.FindFirst(
        System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    if (!long.TryParse(studentIdText, out var studentId))
    {
        return Results.Unauthorized();
    }

    var connectionString =
        configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem(
            "No se encontró la configuración de conexión.",
            statusCode: 500);
    }

    try
    {
        await using var connection =
            new MySqlConnector.MySqlConnection(connectionString);

        await connection.OpenAsync();

        await using var command = connection.CreateCommand();

        command.CommandText = """
            SELECT current_day, last_completed_at
            FROM student_learning_progress
            WHERE student_id = @studentId
            LIMIT 1;
            """;

        command.Parameters.AddWithValue("@studentId", studentId);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return Results.NotFound(new
            {
                mensaje = "El estudiante todavía no tiene progreso registrado."
            });
        }

        return Results.Ok(new
        {
            estudianteId = studentId,
            diaActual = reader.GetInt32(0),
            ultimaFinalizacion = reader.IsDBNull(1)
                ? (DateTime?)null
                : reader.GetDateTime(1)
        });
    }
    catch
    {
        return Results.Problem(
            "No fue posible consultar el progreso.",
            statusCode: 500);
    }
})
.RequireAuthorization();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
