# mcp-mssql-ejemplo.json

## Propósito

Ejemplo de configuración **JSON válida** para el servidor MCP **user-mssql-toolbox** (MSSQL / Microsoft SQL Server). Sirve para copiar al `mcp.json` del usuario de Cursor y que el MCP de base de datos funcione.

## Uso

1. Abre la configuración MCP de Cursor (Settings → MCP) y localiza la ruta de `mcp.json` (p. ej. `C:\Users\<TuUsuario>\.cursor\mcp.json`).
2. Copia el contenido de `mcp-mssql-ejemplo.json` al archivo `mcp.json` del usuario (o fusiona la clave `"mssql"` en el objeto raíz si ya tienes otros servidores).
3. Sustituye los placeholders por valores reales:
   - `TU_HOST`: host del servidor SQL (ej. `paqsuite.database.windows.net` o IP).
   - `TU_BASE_DATOS`: nombre de la base de datos.
   - `TU_USUARIO`: usuario de SQL Server.
   - `TU_PASSWORD`: contraseña.
4. Ajusta la ruta `command` si tu `toolbox.exe` está en otra ubicación (p. ej. `Pabloq` vs `PabloQ` en la ruta del usuario).
5. Reinicia Cursor o recarga la configuración MCP.

## Relación con otros archivos

- **MCP-MySQL-MSSQL-diagnostico.md**: explica por qué “el MCP de mysql” no funciona (MySQL vs MSSQL, JSON inválido en el backup, ruta de toolbox, etc.).
- **mcp_backup.json** (raíz del repo): backup con varias configuraciones MSSQL; no es JSON válido (comentarios y claves duplicadas); usar solo como referencia de variables.

## Notas

- Este archivo **no** incluye credenciales reales. No subas a repositorio un `mcp.json` con contraseñas.
- Para varios entornos (Azure, AWS, local), mantén en `mcp.json` solo **un** servidor `mssql` a la vez o usa nombres distintos (p. ej. `mssql-azure`, `mssql-local`) si Cursor lo permite.
