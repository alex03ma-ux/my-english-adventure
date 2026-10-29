# Documento maestro — My English Adventure

Fecha de revisión: 27 de octubre de 2026.
Repositorio local: `C:\Users\alex0\my-english-adventure-mobile`.

## 1. Visión

Crear una aplicación móvil educativa para aprender inglés progresivamente desde A1 hasta C2, con aprendizaje diario, práctica, repasos y seguimiento individual.

El recorrido completo A1–C2 es una visión del producto; no está implementado actualmente.

## 2. Arquitectura

| Componente | Tecnología y evidencia |
|---|---|
| Aplicación móvil | React Native `0.86.3`, Expo `~57.0.27`, React `19.2.3` y TypeScript `~6.0.3`, declarados en `package.json`. |
| Backend | ASP.NET Core 10 en `backend/MyEnglishAdventure.Api/`. |
| Base de datos | MariaDB, según los esquemas SQL; el backend utiliza MySqlConnector. No se verificó una instancia activa durante esta revisión. |
| Control de versiones | Git, con remoto `origin` alojado en GitHub. |
| Pruebas unitarias | Vitest y archivos de pruebas del módulo de verbos diarios. |

Rutas principales, relativas a la raíz del repositorio:

- `App.tsx`: pantalla inicial de la aplicación.
- `src/features/daily-verbs/`: lógica educativa, tipos y pruebas.
- `backend/MyEnglishAdventure.Api/Program.cs`: endpoints del backend.
- `backend/MyEnglishAdventure.Api/Models/`: modelos y servicios.
- `database/schema/`: esquemas SQL.

La aplicación todavía muestra la pantalla inicial de Expo. No se encontró una integración funcional de esa pantalla con el backend. Expo Router está previsto por las instrucciones del repositorio, pero no figura como dependencia y no se encontró `src/app/`.

## 3. Estado actual

### Implementado en código

**Backend:**

- Registro de estudiantes con validación de nombre, correo y longitud de contraseña.
- Normalización del correo y control de duplicados.
- Hash y verificación de contraseñas mediante ASP.NET Core Identity.
- Inicio de sesión y generación de JWT.
- Endpoint protegido de identidad: `GET /api/students/me`.
- Endpoint protegido de consulta de progreso: `GET /api/students/progress`.
- Consulta de verbos: `GET /api/verbs`.
- Endpoint de diagnóstico de conexión: `GET /api/health/database`.
- Endpoint de ejemplo `/weatherforecast`, sin función educativa.

Estos endpoints se identificaron en el código. La evidencia histórica de pruebas manuales se registra en el apartado siguiente; no se verificó su ejecución durante esta revisión.

**Lógica educativa en TypeScript:**

- Selección de cinco verbos nuevos sin duplicados ni verbos ya aprendidos.
- Validación de asignaciones con cinco verbos diferentes.
- Control de avance diario y bloqueo de saltos de días.
- Dominio basado en cinco sesiones correctas en fechas distintas, sin refuerzo pendiente.
- Marcación de refuerzo tras errores.
- Calendario de repasos con intervalos de 1, 3, 7, 14 y 30 días desde la fecha base correspondiente.
- Selección de repasos vencidos, priorizando refuerzo y menor progreso de dominio.
- Distinción entre sesiones programadas y voluntarias; las voluntarias no suman dominio.

Estas funciones no equivalen todavía a un flujo integrado con pantallas y persistencia.

**Definido mediante tipos:**

Hay modelos para lecciones, verbos, progreso, intentos y ejercicios de selección múltiple, completar espacios, traducción, ordenar palabras y comprensión auditiva. La existencia de estos tipos no confirma interfaces ni motores de ejercicios implementados.

### Pruebas existentes y estado de validación

**Pruebas manuales previas:** según la información aportada por la responsable del proyecto, durante sesiones anteriores se realizaron pruebas manuales satisfactorias de los endpoints de registro, login, identidad y progreso, así como de la conexión con MariaDB. Estas pruebas no fueron repetidas durante esta revisión. Se requiere una nueva validación automatizada para confirmar el comportamiento actual. Las fechas, el entorno y las evidencias detalladas de aquellas ejecuciones quedan pendientes de confirmación.

**Pruebas unitarias presentes en el repositorio:** se encontraron seis archivos:

- `daily-progress.test.ts`
- `verb-mastery.test.ts`
- `review-schedule.test.ts`
- `review-session.test.ts`
- `due-reviews.test.ts`
- `smart-review.test.ts`

Cubren reglas de avance diario, dominio, sesiones y selección de repasos.

**Resultado de ejecución de las pruebas unitarias: pendiente de confirmación.** No se ejecutaron pruebas, lint, typecheck, API ni conexiones a bases de datos durante esta revisión de lectura. No se verificaron pruebas automatizadas de integración ni de extremo a extremo.

### Pendiente

- Creación automática del progreso inicial al registrar un estudiante.
- Pantallas educativas y de autenticación conectadas al backend.
- Persistencia e integración de asignaciones, sesiones y dominio.
- Implementación funcional de los ejercicios.
- Contenido y progresión curricular A1–C2.
- Vocabulario y gramática como módulos completos.
- Administración, roles, auditoría y soporte.
- XP, rankings y batallas.
- Nueva validación automatizada de los flujos del backend probados manualmente en sesiones anteriores.
- Definir una estrategia segura de migraciones antes de aplicar cambios de esquema.

Debe resolverse también la diferencia entre el estado TypeScript `in-progress` y el valor SQL `in_progress` al integrar ambas capas.

## 4. Base de datos

Fuentes:

- `database/schema/001_initial_schema.sql`: seis tablas.
- `database/schema/002_review_mastery_schema.sql`: ocho tablas, incluidas las seis anteriores.

**Advertencia:** el segundo archivo contiene un esquema completo con definiciones repetidas; no debe asumirse que es una migración incremental aplicable después del primero. Estos archivos no se ejecutaron ni modificaron durante esta tarea.

Las ocho tablas documentadas en SQL son:

| Tabla | Propósito y relaciones |
|---|---|
| `students` | Estudiantes: nombre, correo único, hash de contraseña y fechas de creación y actualización. |
| `student_learning_progress` | Progreso general: un registro por estudiante, día actual con valor predeterminado 1 y última finalización. |
| `verbs` | Catálogo de verbos: forma base única, traducción, pasado, participio, pronunciación opcional y estado activo. |
| `verb_examples` | Ejemplos en inglés y español por verbo, clasificados en presente, pasado o futuro. |
| `daily_learning_assignments` | Asignaciones por estudiante y día, con estado y fechas. La combinación estudiante/día es única. |
| `daily_assignment_verbs` | Relación entre asignaciones y verbos, con posición. Evita repetir un verbo o posición dentro de una asignación. |
| `student_verb_mastery` | Seguimiento por estudiante y verbo, con fecha de aprendizaje e indicador de refuerzo. La pareja estudiante/verbo es única. |
| `verb_review_sessions` | Historial de sesiones programadas o voluntarias, fecha, resultado e indicador de cómputo para dominio. Un índice único limita a una sesión computable por dominio y fecha. |

Los esquemas incluyen claves primarias, índices y relaciones mediante claves foráneas. El esquema no impone por sí solo cinco verbos por asignación; esa validación existe en TypeScript.

**Pendiente de confirmación:** tablas efectivamente desplegadas, datos existentes y correspondencia entre el esquema y una instancia activa. No se consultó ninguna base de datos durante esta revisión.

**Tarea pendiente:** definir y revisar una estrategia segura de migraciones que contemple el estado inicial real, versionado, respaldo, validación en un entorno aislado y recuperación ante fallos. Su definición no autoriza ejecutar scripts ni modificar bases de datos.

## 5. Modelo educativo previsto

- Cinco verbos nuevos por día.
- Repasos acumulativos de contenidos anteriores, apoyados en la lógica de calendario y refuerzo existente.
- Vocabulario, gramática y ejercicios variados.
- Progreso individual y avance gradual desde A1 hasta C2.
- Futuros sistemas de XP, rankings y batallas.

Las reglas de verbos y repasos tienen una implementación parcial en funciones TypeScript. El currículo, las pantallas y la experiencia integrada siguen pendientes.

## 6. Administración prevista

Se prevé:

- Gestión de verbos, ejemplos, vocabulario, gramática y ejercicios.
- Rol de superadministradora para administración general.
- Rol de profesores con permisos delimitados.
- Auditoría de acciones y cambios.
- Herramientas de soporte a estudiantes.

No se encontraron implementaciones de estos módulos. Los permisos, flujos y alcance de cada rol están pendientes de definición y confirmación.

## 7. Organización futura de agentes

| Agente | Responsabilidad prevista |
|---|---|
| Coordinador | Mantener el plan, distribuir tareas y revisar coherencia y alcance. |
| Backend | API, autenticación, autorización e integración de reglas educativas. |
| Base de datos | Esquemas, integridad, índices y propuestas de migraciones controladas. |
| Aplicación móvil | Pantallas, navegación, accesibilidad y conexión con la API. |
| QA | Pruebas unitarias, de integración y de extremo a extremo; registro de evidencias. |

Esta organización es una propuesta futura. No implica agentes activos ni autoriza cambios o acceso a datos.

## 8. Reglas de seguridad

- Trabajar exclusivamente dentro de My English Adventure.
- Mantener separación estricta del proyecto de camiones y de la base de datos `camion_ventas`; no acceder a ellos ni reutilizar sus recursos.
- No mostrar, copiar ni registrar contraseñas, tokens, claves o cadenas de conexión.
- Mantener las credenciales fuera del código y de la documentación.
- No ejecutar migraciones ni cambios de datos sin revisión y autorización explícitas.
- Revisar el alcance y el diff de cada cambio antes de integrarlo.
- Separar cambios de código, cambios de esquema y operaciones sobre datos.
- No ejecutar `git add`, `commit` ni `push` sin autorización.
- Marcar como pendiente de confirmación cualquier información no verificada.

## 9. Próxima tarea: progreso inicial en el Día 1

**Objetivo:** crear automáticamente el registro de `student_learning_progress` al registrar un estudiante.

**Situación actual:** el registro inserta únicamente en `students`. El endpoint de progreso devuelve un resultado de no encontrado cuando el estudiante no tiene registro de progreso. El valor predeterminado `current_day = 1` no crea por sí solo ese registro.

**Propuesta para revisión posterior:**

- Crear estudiante y progreso inicial dentro de una misma transacción.
- Establecer `current_day = 1` y `last_completed_at = NULL`.
- Garantizar un solo progreso por estudiante.
- Revertir ambas inserciones si alguna falla.
- Conservar el comportamiento de validación y control de correos duplicados.
- Verificar que el estudiante autenticado pueda consultar su progreso inicial.

La atención a estudiantes ya existentes sin progreso requiere definir un procedimiento separado y autorizado. Esta tarea no incluye crear asignaciones ni seleccionar verbos del Día 1.

## 10. Bitácora

| Fecha | Tipo | Registro | Estado |
|---|---|---|---|
| 2026-10-27 | Revisión | Inspección de estructura, código, esquemas SQL y estado de Git, sin acceso a bases de datos. | Terminada |
| 2026-10-27 | Decisión | Separar funcionalidades implementadas, evidencia de pruebas y planificación futura. Estructura del documento aprobada por la responsable del proyecto. | Aprobada |
| 2026-10-27 | Antecedente de pruebas | La responsable informa pruebas manuales satisfactorias previas de registro, login, identidad, progreso y conexión con MariaDB. No repetidas en esta revisión. | Requiere nueva validación automatizada |
| 2026-10-27 | Documentación | Creación del documento maestro con los ajustes aprobados. | Terminada |
| 2026-10-27 | Próxima tarea | Automatizar el progreso inicial del estudiante en el Día 1. | Pendiente |
| 2026-10-27 | Base de datos | Definir una estrategia segura de migraciones; conservar sin ejecutar ni modificar los dos esquemas SQL durante esta tarea. | Pendiente |

Estado de Git observado antes de crear este documento:

- Rama: `main`.
- Commit: `0c98693e2fb0742102639b2eca8f9752c02afc05`.
- Mensaje: “Backend API: registro, autenticacion JWT y progreso de estudiantes”.
- Entrada sin seguimiento: `src/features/daily-verbs/database`; contenido no revisado.
- Sin modificaciones detectadas en archivos seguidos.

Para nuevas entradas, registrar fecha, decisión o tarea, archivos afectados, validación realizada y próximos pasos, sin incluir secretos ni datos personales.
