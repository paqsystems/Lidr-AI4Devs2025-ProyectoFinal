# Historias de Usuario y Tickets – MVP

## Flujo E2E prioritario
Empleado inicia sesión → registra una tarea diaria → visualiza resumen de su dedicación.

---

## Historias Must-Have

### HU-01 – Login de usuario
**Como** empleado  
**Quiero** iniciar sesión en el sistema  
**Para** poder registrar mis tareas diarias.

**Criterios de aceptación**
- El usuario puede autenticarse con usuario y contraseña.
- Solo usuarios autenticados acceden al sistema.
- Si las credenciales son inválidas, se muestra un mensaje de error.

---

### HU-02 – Registro de tarea diaria
**Como** empleado  
**Quiero** registrar una tarea realizada  
**Para** dejar constancia del trabajo efectuado.

**Datos mínimos**
- Fecha
- Cliente
- Tipo de tarea
- Duración (en minutos u horas)
- Observación opcional

**Criterios de aceptación**
- La duración debe ser mayor a cero.
- La fecha no puede ser futura.
- El registro queda asociado al usuario autenticado.

---

### HU-03 – Visualización de tareas propias
**Como** empleado  
**Quiero** ver mis tareas registradas  
**Para** controlar lo que cargué y corregir errores.

**Criterios de aceptación**
- Se listan las tareas del usuario autenticado.
- Se puede filtrar por fecha.
- Se muestra cliente, tipo y duración.

---

### HU-04 – Edición / eliminación de tarea
**Como** empleado  
**Quiero** editar o eliminar una tarea  
**Para** corregir errores de carga.

**Criterios de aceptación**
- Solo el autor puede modificar una tarea.
- No se permite editar tareas de otros usuarios.

---

## Historias Should-Have

### HU-05 – Resumen de dedicación
**Como** usuario  
**Quiero** ver un resumen de horas por cliente  
**Para** analizar mi dedicación semanal o mensual.

**Criterios de aceptación**
- Agrupación por cliente.
- Total de horas por período.

---

## Tickets técnicos (ejemplo)

- T-01: Implementar endpoint POST /login (HU-01)
- T-02: CRUD de tareas (HU-02, HU-03, HU-04)
- T-03: Vista de resumen (HU-05)
