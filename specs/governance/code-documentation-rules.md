# Reglas de Documentación de Código (Obligatorias)

Estas reglas aplican a **todo el código generado o modificado** en el proyecto,
tanto en **backend** como en **frontend**.

La documentación NO es opcional.

---

## Regla General

Todo código nuevo o modificado DEBE:
- Estar correctamente documentado.
- Ser comprensible sin necesidad de inspeccionar su implementación interna.
- Explicar el propósito y la intención, no solo la sintaxis.

Si el código no está documentado, el cambio se considera incompleto.

---

## Backend (API / C#)

### Clases
Toda clase pública DEBE incluir:
- Un comentario descriptivo a nivel de clase.
- La responsabilidad principal de la clase dentro del sistema.

### Métodos
Todo método público DEBE documentar:
- Qué hace el método.
- El significado de cada parámetro.
- Qué devuelve.
- Posibles errores o casos de fallo a nivel de negocio (si aplica).

Ejemplo (comentarios XML en C#):

```csharp
/// <summary>
/// Crea un nuevo parte de trabajo para el empleado autenticado.
/// </summary>
/// <param name="request">Datos del parte a crear.</param>
/// <returns>El parte creado.</returns>
