# Diagnóstico: MCP MySQL / MSSQL

## Resumen

- **MySQL** (puerto 3306): Hay un MCP **mysql** configurado en Cursor (en tu `mcp.json` de usuario). Usa **Cursor Toolbox** (`toolbox.exe`) con el prebuilt `mysql` y se conecta a **127.0.0.1:3306**. **Requiere que el túnel SSH esté activo** antes de usar el MCP; si no, la conexión falla.
- **MSSQL** (puerto 1433): El MCP **mssql-toolbox** (`user-mssql-toolbox`) se conecta a Microsoft SQL Server.

---

## Dos entradas MSSQL en Cursor

En **Tools & MCP → Installed MCP Servers** pueden aparecer:

- **mssql**: entrada que usa `toolbox.exe` con prebuilt `mssql` y variables `MSSQL_*`. Si esta es la que muestra **Error - Show Output**, el diagnóstico siguiente aplica a ella.
- **mssql-toolbox**: suele ser la que Cursor asocia a las 7 herramientas (listar tablas, describir tabla, etc.). Si esta está en verde, ya tienes un servidor MSSQL funcionando; la entrada **mssql** puede ser redundante o tener otra configuración (otro host/base) que está fallando.

Si **mssql-toolbox** ya funciona, puedes usar solo esa y desactivar o eliminar la entrada **mssql** en tu `mcp.json` para evitar el error. Si quieres que **mssql** funcione (por ejemplo para otro servidor o base), sigue el diagnóstico siguiente.

---

## Diagnóstico paso a paso: MCP mssql con Error

### Paso 1: Ver el mensaje de error (recomendado)

En Cursor: **Settings → Tools & MCP → Installed MCP Servers**, en la entrada **mssql** que está en error, haz clic en **"Error - Show Output"**.

El mensaje suele indicar:

- **"no such file" / "cannot find" / "ENOENT"** → La ruta de `command` (p. ej. `toolbox.exe`) es incorrecta o el ejecutable no existe.
- **"connection refused" / "ECONNREFUSED"** → El servidor SQL no es accesible (firewall, host/puerto mal, servicio apagado).
- **"Login failed" / "authentication"** → Usuario o contraseña incorrectos, o el servidor no acepta la autenticación (modo SQL vs Windows, etc.).
- **"certificate" / "TLS" / "SSL"** → En Azure/AWS a veces hace falta `MSSQL_TRUST_SERVER_CERTIFICATE: "true"` en `env`.

Anota el texto exacto del error; con eso se puede afinar la causa.

### Paso 2: Comprobar la ruta a toolbox.exe

En tu `mcp.json` la entrada **mssql** tiene algo como:

```json
"command": "C:\\Users\\Pabloq\\toolbox.exe"
```

- Debe ser la **misma ruta** que usa la entrada **mysql** que ya te funciona (si mysql usa `Pabloq`, usa esa misma en mssql).
- Comprueba que el archivo exista en esa ruta (abre Explorer y verifica).

Si la ruta está mal, corrígela y recarga MCP o reinicia Cursor.

### Paso 3: JSON válido y una sola entrada mssql

Si copiaste desde `mcp_backup.json`, puede haber:

- Comentarios `// ...` → JSON estándar no los permite; elimínalos.
- Varias claves `"mssql"` en el mismo objeto → deja solo una; si quieres varios entornos, usa claves distintas (p. ej. `"mssql-azure"`, `"mssql-local"`).

Estructura correcta (un solo servidor mssql):

```json
{
  "mssql": {
    "command": "C:\\Users\\Pabloq\\toolbox.exe",
    "args": ["--prebuilt", "mssql", "--stdio"],
    "env": {
      "MSSQL_HOST": "host.o.servidor",
      "MSSQL_PORT": "1433",
      "MSSQL_DATABASE": "nombre_base",
      "MSSQL_USER": "usuario",
      "MSSQL_PASSWORD": "contraseña"
    }
  }
}
```

Para Azure SQL o AWS RDS, añade en `env` si hace falta:

```json
"MSSQL_TRUST_SERVER_CERTIFICATE": "true"
```

### Paso 4: Conectividad al servidor SQL

- **Desde tu PC**: ¿puedes conectarte con otro cliente (SSMS, Azure Data Studio, `sqlcmd`) al mismo `MSSQL_HOST` y puerto?
- **Firewall / red**: en Azure (SQL Database) o AWS RDS hay que autorizar tu IP o VPN; si no, la conexión será rechazada.
- **Host**: usar el FQDN o la URL que te da el proveedor (ej. `paqsuite.database.windows.net`), no solo la IP si el certificado exige nombre.

Si el Paso 1 muestra un error concreto, puedes compartir el mensaje (sin contraseñas) y lo interpretamos.

---

### MSSQL en red local (no Azure ni AWS)

Cuando el servidor SQL está en la **red local** (ej. máquina `PAQ-GAUSS` con instancia nombrada `SQLEXPRESS_AXOFT`), la configuración suele ser:

- **MSSQL_HOST**: `PAQ-GAUSS\\SQLEXPRESS_AXOFT` (en JSON la barra invertida se escapa: `\\`). Es formato **host\instancia**.
- **MSSQL_PORT**: puerto de la instancia (ej. `2544`; no tiene por qué ser 1433).
- **MSSQL_DATABASE**, **MSSQL_USER**, **MSSQL_PASSWORD**: según la base y autenticación SQL.
- **MSSQL_TRUST_SERVER_CERTIFICATE**: `"true"` es habitual en entornos locales.

Cosas a revisar en red local:

1. **Conectividad de red**  
   Desde la PC donde corre Cursor: ¿se puede hacer ping a `PAQ-GAUSS`? ¿resuelve el nombre (DNS o archivo hosts)?

2. **Firewall en el servidor SQL**  
   En la máquina **PAQ-GAUSS**, el Firewall de Windows (o el del antivirus) debe permitir tráfico **entrante** en el puerto que usa la instancia (ej. **2544**). Si ese puerto está bloqueado, la conexión falla aunque el resto esté bien.

3. **Puerto correcto de la instancia**  
   Las instancias nombradas suelen usar un puerto dinámico. El valor **2544** debe ser el puerto real de la instancia `SQLEXPRESS_AXOFT`. Se puede ver en SQL Server Configuration Manager (protocolo TCP/IP → puerto) o en el registro de Windows del servidor.

4. **Autenticación SQL Server**  
   El servidor debe tener habilitada **autenticación mixta** (SQL + Windows) si usas usuario/contraseña (`Axoft`). Si solo acepta Windows, el login SQL fallará.

5. **Formato de host si falla**  
   Si el driver que usa el MCP no acepta bien `host\instancia` con puerto, se puede probar solo el nombre del host (`PAQ-GAUSS`) y puerto, si la instancia escucha en ese puerto; depende del cliente que use toolbox.

---

### Error: "invalid URL escape \"%5C\"" o "No server info found"

El toolbox (genai-toolbox) construye una URL de conexión `sqlserver://usuario:contraseña@HOST:puerto?database=...`. Si **MSSQL_HOST** incluye la barra invertida de la instancia (`PAQ-GAUSS\SQLEXPRESS_AXOFT`), se codifica como `%5C` en la URL. El parser de la URL **no acepta** `%5C` en la parte del host y devuelve:

- `invalid URL escape "%5C"`  
o, en otros intentos,  
- `No server info found`.

**Solución:** no poner la instancia en el host. Como ya indicas el **puerto** (2544), la conexión puede ir directa al host y puerto, sin usar el nombre de instancia en la URL.

En tu `mcp.json`, cambia la entrada **mssql** así:

- **Antes:** `"MSSQL_HOST": "PAQ-GAUSS\\SQLEXPRESS_AXOFT"`
- **Después:** `"MSSQL_HOST": "PAQ-GAUSS"`

Mantén **MSSQL_PORT**: `"2544"` y el resto igual. La URL que se generará será del tipo `sqlserver://usuario:contraseña@PAQ-GAUSS:2544?database=Lidr`, sin barra invertida en el host, y el toolbox debería conectar correctamente.

Tras guardar el `mcp.json`, recarga MCP o reinicia Cursor y prueba de nuevo.

---

## Por qué puede no funcionar el MCP de MSSQL (resumen)

### 1. Configuración activa de MCP

Cursor no usa `mcp_backup.json` del repo para arrancar los servidores MCP. Usa la configuración de MCP del **usuario**, normalmente en:

- **Windows**: `C:\Users\<TuUsuario>\.cursor\mcp.json`  
  (o la ruta que muestre Cursor en **Settings → MCP**).

Si solo tienes el contenido en `mcp_backup.json` y no lo has copiado/adaptado a ese `mcp.json`, el servidor MSSQL no estará bien configurado para Cursor.

### 2. `mcp_backup.json` no es JSON válido

El archivo `mcp_backup.json` del proyecto **no es JSON válido**. Por eso, si en algún momento se usara tal cual, fallaría:

- **Comentarios** `// AZURE`, `// AWS RDS`, etc.: JSON estándar no permite comentarios.
- **Claves duplicadas** `"mssql"`: en un mismo objeto solo puede haber una clave `"mssql"`; las demás se ignoran o pueden dar error en algunos parsers.

Para que funcione, hace falta **un único objeto** por servidor (por ejemplo un solo `mssql`) y **sin comentarios**, como en el ejemplo de la siguiente sección.

### 3. Ruta a `toolbox.exe`

En el backup aparece:

```text
"command": "C:\\Users\\Pabloq\\toolbox.exe"
```

Comprueba:

- Que la ruta sea la correcta en tu máquina (incluido **Pabloq** vs **PabloQ**, según cómo esté tu carpeta de usuario).
- Que `toolbox.exe` exista ahí (Cursor Toolbox u otra herramienta que arranque el MCP MSSQL).

Si la ruta es incorrecta o el ejecutable no está, el MCP no arrancará.

### 4. Variables de entorno de conexión

El servidor MCP de MSSQL necesita variables de entorno para conectarse a SQL Server, por ejemplo:

- `MSSQL_HOST`
- `MSSQL_PORT`
- `MSSQL_DATABASE`
- `MSSQL_USER`
- `MSSQL_PASSWORD`
- Opcional: `MSSQL_TRUST_SERVER_CERTIFICATE` (por ejemplo `"true"` en dev)

Si en tu `mcp.json` no se definen estas variables (o están mal), la conexión desde el MCP fallará aunque el proceso del MCP arranque.

### 5. Conectividad y firewall

Para MSSQL en la nube (Azure, AWS, etc.):

- Debe ser accesible desde tu red (IP autorizada, VPN, etc.).
- Puerto 1433 (o el que use tu instancia) abierto en firewall/security group.

Si el MCP arranca pero las herramientas (listar tablas, consultas, etc.) fallan, suele ser por conexión o credenciales.

---

## Qué hacer para que funcione el MCP de MSSQL

1. **Abrir la configuración MCP de Cursor**  
   - **Settings → MCP** (o **Cursor Settings → MCP**) y ver la ruta del archivo de configuración (p. ej. `~/.cursor/mcp.json` o `C:\Users\<TuUsuario>\.cursor\mcp.json`).

2. **Usar un JSON válido**  
   - En ese archivo, definir **un solo servidor** `mssql` y **sin comentarios**. Puedes basarte en el ejemplo del repo: `.cursor/Docs/mcp-mssql-ejemplo.json`. Copia ese contenido a tu `mcp.json` de usuario (normalmente `C:\Users\<TuUsuario>\.cursor\mcp.json`) y sustituye `TU_HOST`, `TU_BASE_DATOS`, `TU_USUARIO`, `TU_PASSWORD` por los valores reales. Comprueba también que la ruta `command` sea la correcta en tu PC (por ejemplo `PabloQ` vs `Pabloq` en la ruta del usuario).

3. **Ajustar ruta de `toolbox` y variables**  
   - Poner la ruta real a `toolbox.exe` en tu PC.  
   - Rellenar `env` con el host, puerto, base de datos, usuario y contraseña correctos (o usar variables de entorno del sistema y referenciarlas si tu herramienta lo permite).

4. **Reiniciar Cursor** (o recargar MCP si la opción está disponible) y probar de nuevo las herramientas del servidor **mssql-toolbox**.

---

## MCP MySQL: configuración y túnel SSH

El MCP **mysql** está definido en tu `mcp.json` de usuario con una configuración similar a:

- **command**: `C:\Users\Pabloq\toolbox.exe` (Cursor Toolbox).
- **args**: `["--prebuilt", "mysql", "--stdio"]`.
- **env**: `MYSQL_HOST=127.0.0.1`, `MYSQL_PORT=3306`, `MYSQL_DATABASE=Lidr_testing`, `MYSQL_USER=forge`, `MYSQL_PASSWORD=...`.

**Dependencia obligatoria:** `MYSQL_HOST=127.0.0.1` implica que el MCP espera MySQL en **localhost:3306**. La base de datos real está en un servidor remoto (p. ej. Laravel Forge), por lo que **hay que tener el túnel SSH activo** para que el puerto remoto 3306 quede redirigido a `127.0.0.1:3306`. Sin el túnel, el MCP arranca pero falla al conectar (Error - Show Output).

### Orden correcto para que funcione el MCP mysql

1. **Primero:** Iniciar el túnel SSH (en una terminal del proyecto):
   ```powershell
   cd "C:\Programacion\Lidr\Lidr-AI4Devs2025-ProyectoFinal"
   .\scripts\ssh-tunnel-mysql.ps1
   ```
   O bien: `ssh -i "C:\Users\Pabloq\pablo-notebook" -o StrictHostKeyChecking=no -L 3306:127.0.0.1:3306 -N forge@18.218.140.170`
2. **Después:** Usar Cursor y el MCP mysql (o recargar MCP si Cursor ya estaba abierto).

### Si el MCP mysql sigue en error

- Comprobar que la ruta a `toolbox.exe` sea correcta (p. ej. `Pabloq` vs `PabloQ` en la ruta del usuario).
- Comprobar que el prebuilt `mysql` exista en tu versión de Cursor Toolbox.
- En Cursor: **Error - Show Output** en el servidor mysql para ver el mensaje exacto (conexión rechazada, ejecutable no encontrado, etc.).

---

## Referencias en el proyecto

- `mcp_backup.json`: backup de configuraciones MSSQL (no válido como JSON; usar solo como referencia de variables).
- `docs/agentes-y-mcp.md` (o `.cursor/Docs/Agentes-y-mcp.md`): lista MCPs y menciona “Ver mcp.json”; el `mcp.json` activo es el del usuario, no el del repo.
- **Regla SSH para MySQL**: `.cursor/rules/00-Iniciar-tunel-SSH-para-MySql.md` y `scripts/ssh-tunnel-mysql.ps1`. El túnel es **necesario** para que el MCP mysql en Cursor pueda conectarse a la base `Lidr_testing`.

---

**Última actualización:** 2025-01-29
