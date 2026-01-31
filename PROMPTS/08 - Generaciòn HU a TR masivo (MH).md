# 08 - Generaciòn HU a TR masivo (MH).md

## Historias Pendientes a Procesar

### Informes
HU	Descripción
HU-044(MH)	Consulta detallada de tareas
HU-046(MH)	Consulta agrupada por cliente
HU-050(MH)	Manejo de resultados vacíos en consultas
### Dashboard
HU	Descripción
HU-051(MH)	Dashboard principal
HU-052(MH)	Resumen de dedicación por cliente en dashboard
### Gestión Clientes (Épica)
HU	Descripción
HU-008(MH)	Listado de clientes
HU-009(MH)	Creación de cliente
HU-010(MH)	Edición de cliente
HU-011(MH)	Eliminación de cliente
HU-012(MH)	Asignación de tipos de tarea a cliente
### Gestión Tipos Cliente
HU	Descripción
HU-014(MH)	Listado de tipos de cliente
HU-015(MH)	Creación de tipo de cliente
HU-016(MH)	Edición de tipo de cliente
HU-017(MH)	Eliminación de tipo de cliente
### Gestión Empleados
HU	Descripción
HU-018(MH)	Listado de empleados
HU-019(MH)	Creación de empleado
HU-020(MH)	Edición de empleado
HU-021(MH)	Eliminación de empleado
### Gestión Tipos de Tarea
HU	Descripción
HU-023(MH)	Listado de tipos de tarea
HU-024(MH)	Creación de tipo de tarea
HU-025(MH)	Edición de tipo de tarea
HU-026(MH)	Eliminación de tipo de tarea


## Generación HU a Tareas 

Aplicá el flujo definido para conversión de Historias de Usuario a tareas
sobre las Historias de Usuario numeradas anteriormente en tópico "Historias Pendientes",
ubicadas en la carpeta docs/hu-historias/., en el orden en que se presentan.

Procesá únicamente archivos cuyo nombre o contenido identifique
claramente a los números de historias señalados.

Condiciones obligatorias:
- Todas las HU indicadas son MUST-HAVE.
- Determiná automáticamente si cada HU es SIMPLE o COMPLEJA,
  según las reglas ya definidas en el proyecto.
- En caso de duda razonable sobre si una HU debe tratarse como SIMPLE o COMPLEJA:
  - Adoptá un criterio conservador y tratala como HU COMPLEJA.
  - Documentá explícitamente la duda y el motivo de la ambigüedad.
- Generá únicamente las tareas necesarias para implementar cada HU.
- NO ejecutes tareas.
- NO escribas código.
- NO inicialices servidores.
- NO modifiques otros archivos fuera del indicado.

Para cada HU:
1. Indicá si fue tratada como HU SIMPLE o HU COMPLEJA.
2. Si es COMPLEJA, descomponela primero en sub-historias lógicas.
3. Generá las tareas técnicas correspondientes.
4. Clasificá cada tarea por capa:
   - Backend
   - Frontend
   - Base de Datos
   - QA / Testing
5. Indicá dependencias entre tareas si las hubiera.
6. Verificá coherencia con el MVP y los entregables definidos.
7. Marcá las HU tratadas como COMPLEJAS por criterio conservador
   con la etiqueta: [REVISAR_SIMPLICIDAD]

Registrá el resultado de forma ordenada en:
docs/tareas-generadas-hu-Must Have.md

Este trabajo es exclusivamente de análisis y planificación.
