# Instrucciones de trabajo — My English Adventure

## 1. Alcance del proyecto

- Trabajar exclusivamente en `C:\Users\alex0\my-english-adventure-mobile`.
- No acceder, inspeccionar ni modificar el proyecto de camiones ni la base de datos `camion_ventas`.
- No modificar otros repositorios ni carpetas externas.
- Mantener separados el código, las credenciales, las conexiones y los datos de ambos proyectos.
- Las consultas de documentación técnica pública no autorizan acceder a otros proyectos locales.

## 2. Documento maestro

- Consultar `docs/DOCUMENTO_MAESTRO.md` antes de planificar cambios.
- Respetar las decisiones documentadas.
- Diferenciar lo implementado, lo probado, lo previsto y lo pendiente de confirmación.
- No presentar funcionalidades previstas como si ya estuvieran implementadas.
- Si el código y el documento difieren, informar la discrepancia antes de proponer cambios.
- Proponer actualizaciones del documento cuando se aprueben nuevas decisiones.
- Solicitar aprobación antes de modificar el documento maestro.

## 3. Control de cambios

- Antes de desarrollar, revisar en modo lectura el código pertinente y el estado de Git.
- Explicar qué se hará, qué archivos podrían crearse o modificarse y cómo se verificará el resultado.
- Solicitar aprobación antes de realizar cambios.
- Limitar los cambios al alcance aprobado. Si hace falta ampliarlo, explicar el motivo y solicitar nueva aprobación.
- No eliminar ni sobrescribir trabajo existente sin autorización.
- Preservar los cambios locales y archivos sin seguimiento que ya existan.
- No ejecutar `git add`, `commit`, `push`, `reset`, `clean` ni operaciones destructivas sin autorización explícita.
- Preferir ramas de trabajo para nuevas funcionalidades, previa aprobación.
- Usar el prefijo `codex/` para ramas nuevas, salvo indicación distinta de la responsable.
- Al finalizar, informar archivos afectados, cambios realizados, verificaciones y pendientes.
- La aprobación de una tarea no autoriza automáticamente otra funcionalidad.

## 4. Seguridad y bases de datos

- No mostrar, copiar ni registrar contraseñas, tokens, claves o cadenas de conexión.
- No abrir archivos de secretos ni consultar almacenes de credenciales.
- No modificar archivos de secretos ni credenciales.
- Si una tarea requiere configuración sensible, explicar qué configuración se necesita sin solicitar que se publique su valor.
- No ejecutar migraciones ni modificar datos sin aprobación específica.
- No realizar conexiones o consultas a bases de datos fuera del alcance expresamente autorizado.
- Mantener completamente separadas las bases de datos de My English Adventure y del proyecto de camiones.
- No acceder a `camion_ventas` bajo ninguna tarea de este repositorio.
- No ejecutar pruebas que creen, modifiquen o eliminen datos sin autorización específica para ese entorno.

### Advertencia sobre los archivos SQL

- `database/schema/001_initial_schema.sql` define seis tablas.
- `database/schema/002_review_mastery_schema.sql` contiene un esquema completo de ocho tablas, incluidas las seis anteriores.
- No asumir que el segundo archivo es una migración incremental aplicable después del primero.
- No ejecutar ni modificar estos archivos sin aprobación específica.
- Mantener pendiente la definición de una estrategia segura de migraciones, con revisión del estado inicial, respaldo, validación en un entorno aislado y recuperación ante fallos.
- La aprobación de una propuesta de migración no equivale a autorización para ejecutarla.

## 5. Calidad y arquitectura

- Mantener la arquitectura existente:
  - React Native, Expo y TypeScript para la aplicación móvil.
  - ASP.NET Core 10 para el backend.
  - MariaDB para la persistencia.
  - Git y GitHub para control de versiones.
- Priorizar patrones móviles, rendimiento y compatibilidad entre plataformas.
- Implementar funcionalidades pequeñas y verificables.
- Evitar cambios de arquitectura, reorganizaciones amplias y dependencias nuevas sin justificación y aprobación.
- Proponer pruebas para cada cambio.
- Ejecutar únicamente las verificaciones compatibles con el alcance aprobado y las restricciones de seguridad.
- Antes de ejecutar lint o typecheck, verificar en modo lectura si están configurados y si sus herramientas están disponibles localmente.
- Ejecutar lint y typecheck únicamente cuando correspondan a la tarea aprobada y no impliquen modificaciones de archivos ni instalaciones. Utilizar comprobaciones sin corrección automática, sin generación de archivos y sin escritura de cachés.
- Si no están configurados o disponibles, informar la limitación. No instalar herramientas, crear configuración ni ampliar permisos para ejecutarlos sin aprobación.
- Informar errores, riesgos, limitaciones y tareas pendientes.
- No afirmar que una funcionalidad fue probada si no se ejecutaron sus pruebas.
- Distinguir entre inspección de código, pruebas presentes en el repositorio, pruebas ejecutadas y antecedentes informados por la responsable.
- Registrar que las pruebas manuales anteriores de registro, login, identidad, progreso y conexión con MariaDB fueron informadas como satisfactorias; no tratarlas como una validación automatizada actual.

## 6. Reglas técnicas de Expo y React Native

### Consultar documentación antes de programar

Expo puede introducir cambios incompatibles entre versiones. Antes de escribir código que utilice APIs de Expo, EAS o React Native:

1. Leer la versión principal de `expo` en `package.json`.
2. Consultar la documentación correspondiente: `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Para otros temas de Expo, consultar `https://docs.expo.dev/llms.txt` y seguir los enlaces a la documentación específica y sus correcciones de errores comunes.

No asumir que una API recordada sigue vigente: puede haber cambiado de nombre, ubicación o haber sido eliminada.

### Dependencias y comandos

- Si existe `bun.lock`, utilizar `bunx` en lugar de `npx`.
- Para instalar dependencias de la aplicación Expo, utilizar `expo install` con el ejecutor correspondiente, en lugar de instalarlas directamente con npm, Yarn, pnpm o Bun; resuelve versiones compatibles con el SDK.
- Preferir módulos recomendados por Expo y revisar las habilidades disponibles antes de proponer dependencias.
- Estos comandos son referencias; no autorizan su ejecución fuera del alcance aprobado:

```bash
npx expo install <package>  # Instalar una dependencia compatible con el SDK
npx expo start              # Iniciar el servidor de desarrollo
npx expo lint               # Lint; comprobar antes su configuración y efectos
npx tsc --noEmit            # Typecheck; comprobar antes su configuración y efectos
npx expo-doctor             # Diagnosticar dependencias y configuración
npx expo install --fix      # Corregir versiones incompatibles
```

- `expo install` y `expo install --fix` modifican dependencias y requieren aprobación previa.
- No permitir descargas o instalaciones implícitas del ejecutor para comprobaciones autorizadas únicamente en lectura.
- Si el proyecto no tiene configurada una comprobación, informar esa limitación antes de añadir configuración o herramientas.

### Navegación

- Utilizar Expo Router para nuevas implementaciones de navegación, según las instrucciones técnicas del proyecto.
- Las rutas deben ubicarse en `src/app/`; cada archivo de ruta representa una pantalla y los archivos `_layout.tsx` definen navegadores.
- Mantener componentes, hooks y utilidades fuera de `src/app/`.
- Importar `Link`, `router` y `useLocalSearchParams` desde `expo-router`.
- Según la revisión documentada, Expo Router no figura como dependencia y no se encontró `src/app/`; su incorporación o la adaptación de la estructura requiere aprobación.
- Documentación: `https://docs.expo.dev/router/introduction.md`.

### Configuración nativa y EAS

- Si no existen `ios/` y `android/`, se utiliza generación nativa continua (Continuous Native Generation). No crear ni editar esas carpetas manualmente; configurar el comportamiento nativo mediante `app.json` y plugins de configuración.
- Expo Go solo incluye sus módulos nativos incorporados.
- Si se aprueba una biblioteca con código nativo, explicar la necesidad de una compilación de desarrollo: `npx expo run:ios` o `npx expo run:android` localmente, o una compilación EAS con el perfil `development`, usando el ejecutor correspondiente.
- Utilizar EAS para compilación, firma, envío y actualizaciones remotas, previa autorización de la operación. Las operaciones en la nube no requieren Xcode ni Android Studio locales.
- En proyectos Bun, ejecutar EAS como `bunx eas-cli <comando>`.
- En los demás casos, utilizar `npx eas-cli@latest <comando>`.
- Sustituir los ejemplos de `eas build`, `eas submit` y `eas update` de la documentación por el ejecutor correspondiente; para desarrollo, usar `<ejecutor EAS> build --profile development`.
- No iniciar compilaciones, envíos ni publicaciones de actualizaciones sin aprobación específica.
- Documentación: `https://docs.expo.dev/eas/index.md`.
- Referencia general de módulos Expo: `https://docs.expo.dev/versions/latest/index.md`; comprobar siempre su compatibilidad con el SDK del proyecto.

## 7. Comunicación

- Responder siempre en español.
- Explicar los pasos con claridad para una persona que está aprendiendo programación.
- Explicar los términos técnicos cuando sean necesarios.
- Trabajar una tarea a la vez.
- Presentar primero la propuesta y esperar aprobación antes de modificar archivos.
- Al terminar una tarea, informar el resultado y esperar confirmación antes de pasar a otra funcionalidad.
- Cuando una información no pueda verificarse, marcarla como pendiente de confirmación.
- Si una tarea está bloqueada, explicar qué falta y qué decisión se necesita.

## 8. Responsabilidades especializadas propuestas

- Coordinador: planificación, delimitación del alcance y seguimiento.
- Backend: API y lógica del servidor.
- Base de datos: esquemas, integridad y propuestas de migración.
- Móvil: React Native, Expo e integración de la aplicación.
- QA: pruebas, validación y registro de resultados.

Estos roles representan responsabilidades propuestas. No son agentes independientes activos automáticamente.

No iniciar agentes especializados ni delegar trabajo automáticamente. Si se propone utilizarlos, explicar su alcance y solicitar autorización. Todos deben respetar estas instrucciones y los límites de la tarea aprobada.
