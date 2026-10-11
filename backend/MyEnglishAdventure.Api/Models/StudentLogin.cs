
using System.ComponentModel.DataAnnotations;

namespace MyEnglishAdventure.Api.Models;

public class StudentLogin
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
