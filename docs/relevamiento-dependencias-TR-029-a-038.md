# Relevamiento de Dependencias – TR-029 a TR-038

**Fecha:** 2026-01-28  
**Alcance:** TRs generados para HU-029 a HU-038 (Épica 7: Registro de Tareas)

---

## 1) Grafo de dependencias entre TRs (029–038)

```
                    TR-028 (Carga de tarea diaria) ✅ IMPLEMENTADO
                    │
    ┌───────────────┼───────────────┬───────────────┬───────────────┐
    │               │               │               │               │
    ▼               ▼               ▼               ▼               ▼
 TR-029          TR-030          TR-033          TR-035          TR-037
 (Edición        (Eliminación    (Lista          (Validación     (Filtrado
  propia)         propia)         propias)         duración)       tipos)
    │               │               │               │               │
    │               │               │               │               │
    │               │         ┌─────┴─────┐         │               │
    │               │         │           │         │               │
    │               └────────┼───────────┼─────────┘               │
    │                         │           │                         │
    │                         ▼           ▼                         │
    │                    TR-029       TR-030                        │
    │                    (botón       (botón                        │
    │                     editar)      eliminar)                    │
    │                         │           │                         │
    ├─────────────────────────┘           │                         │
    │                                     │                         │
    ▼                                     │                         │
 TR-031 ◄─────────────────────────────────┘                         │
 (Edición                                                           │
  supervisor)                                                        │
    │               TR-032                                          │
    │               (Eliminación                                     │
    │                supervisor)                                      │
    │               │                                                │
    │               │         TR-033                                 │
    │               │         (lista)                                │
    │               │               │                                │
    └───────────────┴───────────────┼───────────────────────────────┘
                                    │
                                    ▼
                                TR-034
                                (Lista todas
                                 supervisor)
```

**Leyenda:**  
- TR-028 es la base (ya implementado).  
- TR-033 depende de TR-028; TR-029 y TR-030 necesitan TR-033 para los botones editar/eliminar en la lista.  
- TR-031 y TR-032 extienden TR-029 y TR-030 para supervisores.  
- TR-034 depende de TR-033, TR-031 y TR-032.  
- TR-035, TR-036, TR-037, TR-038 dependen solo de TR-028 (y están parcialmente cubiertos en TR-028).

---

## 2) Dependencias por TR (detalle)

| TR | Dependencias declaradas | Estado de cada dependencia |
|----|-------------------------|----------------------------|
| **TR-029** | TR-028, TR-033 (para botón editar en lista) | TR-028 ✅ | TR-033 ✅ (generado) |
| **TR-030** | TR-028, TR-033 (para botón eliminar en lista) | TR-028 ✅ | TR-033 ✅ |
| **TR-031** | TR-028, TR-029, **HU-019** (gestión usuarios) | TR-028 ✅ | TR-029 ✅ | **TR-019 no existe** |
| **TR-032** | TR-028, TR-030, TR-033 | TR-028 ✅ | TR-030 ✅ | TR-033 ✅ |
| **TR-033** | TR-028, TR-029, TR-030 | TR-028 ✅ | TR-029 ✅ | TR-030 ✅ |
| **TR-034** | TR-028, TR-031, TR-032, TR-033 | Todas ✅ |
| **TR-035** | TR-028, TR-029 (UpdateTaskRequest) | TR-028 ✅ | TR-029 ✅ |
| **TR-036** | TR-028 | TR-028 ✅ |
| **TR-037** | TR-028, **HU-012** (asignación tipos a clientes) | TR-028 ✅ | **TR-012 no existe** |
| **TR-038** | TR-028, **HU-019** (gestión usuarios) | TR-028 ✅ | **TR-019 no existe** |

---

## 3) Dependencias de TR-028 (base de la épica)

Según HU-028 y TR-028:

| Dependencia | Descripción | ¿Existe TR? | Observación |
|-------------|-------------|-------------|-------------|
| HU-001 | Login empleado | ✅ TR-001 | Implementado |
| HU-009 | Creación de cliente | ❌ No hay TR-009 | Listado/clientes: se usa GET /tasks/clients (datos por seed o por futuro CRUD). |
| HU-024 | Creación de tipo de tarea | ❌ No hay TR-024 | Tipos: se usa GET /tasks/task-types (datos por seed o por futuro CRUD). |
| HU-012 | Asignación de tipos de tarea a cliente | ❌ No hay TR-012 | Filtrado por cliente ya implementado; datos en ClienteTipoTarea (seed o futura UI). |

---

## 4) TRs / HUs referenciados que NO existen

| ID | Nombre (HU) | Referenciado en | ¿Amerita generar TR? |
|----|-------------|-----------------|----------------------|
| **TR-019** | HU-019 Creación de empleado | TR-031, TR-038 | **Opcional para MVP** – El selector de empleados (TR-028/038) usa GET /tasks/employees; con empleados por seed alcanza. Generar TR-019 sirve si se quiere alta de empleados desde la UI. |
| **TR-012** | HU-012 Asignación de tipos de tarea a cliente | TR-037, TR-028 | **Opcional para MVP** – El filtrado por cliente (TR-028/037) ya usa ClienteTipoTarea; con seed alcanza. Generar TR-012 sirve si se quiere asignar tipos a clientes desde la UI. |
| **TR-009** | HU-009 Creación de cliente | TR-028 | **Opcional para MVP** – Clientes se obtienen por GET /tasks/clients; con seed alcanza. TR-009 sería para crear clientes desde la UI. |
| **TR-024** | HU-024 Creación de tipo de tarea | TR-028 | **Opcional para MVP** – Tipos por GET /tasks/task-types; con seed alcanza. TR-024 sería para crear tipos desde la UI. |

---

## 5) Orden sugerido de implementación (respetando dependencias)

1. **TR-028** – Ya implementado ✅  
2. **TR-033** – Lista de tareas propias (necesaria para botones editar/eliminar).  
3. **TR-029** – Edición propia (usa lista TR-033).  
4. **TR-030** – Eliminación propia (usa lista TR-033).  
5. **TR-031** – Edición supervisor (extiende TR-029).  
6. **TR-032** – Eliminación supervisor (extiende TR-030).  
7. **TR-034** – Lista todas las tareas (supervisor).  
8. **TR-035, TR-036, TR-037, TR-038** – Verificación/documentación de lo ya cubierto en TR-028 (sin bloqueos).

**Nota:** TR-033 puede implementarse sin TR-029/030 terminados; los botones editar/eliminar pueden habilitarse cuando existan TR-029 y TR-030.

---

## 6) Conclusión: ¿generar más TRs?

- **Para cerrar la épica 7 (registro de tareas) con TR-029 a TR-038:**  
  **No es obligatorio** generar más TRs. Las dependencias faltantes (HU-019, HU-012, HU-009, HU-024) se resuelven hoy con **datos de seed** y endpoints ya previstos en TR-028.

- **Sí amerita generar TRs adicionales si se quiere:**
  - **Alta y gestión de empleados desde la UI** → TR-019 (y conviene HU-018 listado como base).
  - **Asignación de tipos de tarea a clientes desde la UI** → TR-012.
  - **Alta de clientes desde la UI** → TR-009 (típicamente con HU-008 listado).
  - **Alta de tipos de tarea desde la UI** → TR-024 (típicamente con HU-023 listado).

Recomendación: mantener TR-029 a TR-038 como están; si el MVP exige gestión completa desde la UI (empleados, clientes, tipos de tarea, asignaciones), planificar en una siguiente iteración los TR correspondientes a HU-008, HU-009, HU-012, HU-018, HU-019, HU-023, HU-024 según prioridad de producto.
