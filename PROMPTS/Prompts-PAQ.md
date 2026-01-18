# PROMPTS RELEVANTES

## Prompt 1 - Definiciones de contexto y normativas para el back-end

ubicate en el rol de experimentado programador de Php-Laravel, con dominio de bases de datos SQL de diversas plataformas.
Necesitamos configurar todos los archivos de contexto y normativas para la programación del backend y el diseño de la base de datos para el sistema de partes de atención para consultorías y empresas de servicios detalladas en el contexto general.
es imprescindible para ello:
1) Considerar las buenas practicas de programación.
2) Contemplar las 4 normas formales de diseño de base de datos
3) Prever todos los esquemas de seguridad imprescindibles para el acceso a la aplicación
4) Idem 3) con respecto a la definición de las API, impidiendo hackeos e introducción de código malicioso


## Prompt 2 - Ajustes al diseño de la información

Importante: si durante la implementación detectas decisiones abiertas (reglas de negocio), NO las resuelvas; dejalas como TODO en documentación, sin código.

Objetivo: aplicar SOLO ajustes de diseño/modelo al dominio “Tipos de tarea” del MVP Sistema de Partes, sin implementar aún reglas completas ni cambiar endpoints/UI salvo lo mínimo para reflejar el modelo.

Cambios requeridos (SOLO diseño/modelo):
1) En la entidad/tabla TaskType (TipoDeTarea), agregar dos campos booleanos:
   - isGeneric (generico)
   - isDefault (porDefecto)
   Definir su significado en comentarios/documentación del modelo (sin imponer aún validaciones complejas).

2) Incorporar una relación explícita para asignar tipos de tarea NO genéricos a clientes:
   - Nueva tabla de asociación ClientTaskType (ClienteTipoTarea)
   - Campos mínimos: clientId, taskTypeId
   - (Opcional) unique constraint (clientId, taskTypeId) si ya usas migraciones/constraints. Si no, solo documentarlo.

Alcance / restricciones:
- NO implementes todavía la regla “solo un TaskType puede ser porDefecto en todo el sistema”.
- NO implementes todavía la regla de visibilidad “al crear tarea mostrar genéricos + asociados al cliente”.
- NO agregues endpoints nuevos ni cambies rutas.
- NO agregues lógica de negocio ni validaciones más allá de lo estrictamente necesario para persistir los nuevos campos y la relación.
- NO cambies la UI.
- SOLO actualizar: modelo de datos, migraciones (si existen), entidades/ORM, y documentación de arquitectura/specs donde corresponda.

Archivos a actualizar:
- Modelo/entidades (TaskType y la nueva relación ClientTaskType)
- Migraciones / schema
- /architecture/api-to-data-mapping.md (agregar mención de isGeneric/isDefault y ClientTaskType)
- Si existe documentación de dominio, agregar una nota breve con la definición semántica de ambos flags.

Entrega esperada:
- Cambios de código y migraciones compilables
- Documentación mínima actualizada (sin reglas de negocio todavía)


## Prompt 3 - Definiciones de contexto y normativas para el front-end

nos vamos a abocar ahora a definir todas las especificaciones y normativas para el Front end. para eso, te pido te coloques en el rol de un analista programador senior en entorno front-end web, especializado en herramientas de javascript y typescript, como react, que es la herramienta que vamos a usar específicamente. 
te pido me elabores todas las consideraciones para incorporar, conservando las buenas prácticas de programación. 
de mi parte, solicito incluir estas consideraciones : 
- que todos los controles usen la propiedad "data-testid", para utilizar en el testing TDD con playwright 
- que genere por separado html, css y js 
- que sea multilingual : para esto, pensar una clase que reciba un texto, y según una variable de entorno que se define previamente, devolverlo en el idioma seleccionado. provisoriamente, retornará el mismo texto que recibe, hasta que decidamos qué herramienta o extensión utilizaremos para las traducciones. esto debe impactar en cualquier texto que se exponga al usuario : captions, labels, tooltips, nulltext, message, etc.

## Prompt 4 - Evitar duplicidad de código

necesito que agregues en un archivo de contexto macro esta consigna : "en toda la programación, tanto back-end como front-end, evitar la duplicidad de código. generar métodos o funciones apropiados para su reutilización, y si se detecta que un código se puede incorporar a un método existente agregando algún/os parámetro/s y modificando la codificación del mismo, proponermelo antes de realizarlo"

## Prompt 5 - Ajustes al contexto de Front-End

a) con respecto a toda la definición del contexto de front-end, te pido verifiques, hayas considerado que la programación se estructure separando el css del html y del js.
b) te pido también verificarr y corregir si es necesaria la documentación, para considerar que todos los controles usen la propiedad "data-testid", para utilizar en el testing TDD con playwright, como así también contemplar siempre la accesibilidad, también para optimizaciones de testing
c) te modifiqué el archivo 03-i18n-and-testid.mdc en función a algo que ya había analizado y definido por chatgpt en forma más profunda. te pido que lo revises, lo traduzcas al español, y amplíes todo lo que consideres necesario para optimizar tu contexto, respetando la consigna acá definida
