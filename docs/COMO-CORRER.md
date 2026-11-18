# Cómo correr el ambiente (sin depender del PC de Camilo)

Hay dos opciones; cada uno escoge la suya.

| Opción | Para quién | Qué necesita |
|---|---|---|
| **A. GitHub Codespaces** | Paulina y Valeria (recomendada) | Solo navegador y cuenta GitHub con acceso al repo |
| **B. PC propio** | César (ZAP corre mejor en local) | Docker Desktop, Git y Java 17 o superior |

---

## Opción A – GitHub Codespaces

1. En el repositorio: **Code → Codespaces → Create codespace on main**. Para ZAP o Playwright conviene **New with options → 4-core**.
2. Espera a que termine de crearse (el primer arranque tarda unos minutos: instala Java 21, Node y Docker).
3. En la terminal del Codespace:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Cuando aparezca `Started PetClinicApplication`, abre la pestaña **Ports**, busca el **8080** y haz clic en el globo para abrir la app en el navegador.
5. Para detener la app: `Ctrl+C`.

## Opción B – PC propio (Windows, CMD)

```cmd
cd /d C:\
mkdir ITM
cd /d C:\ITM
git clone -c core.autocrlf=false https://github.com/CamiloO15H/qa-petclinic-grupo4.git
cd qa-petclinic-grupo4
mvnw.cmd clean verify
mvnw.cmd spring-boot:run
```

- `-c core.autocrlf=false` evita que Windows cambie los saltos de línea. Si los cambia, el validador de formato del proyecto tumba el build.
- `mvnw.cmd clean verify` compila y corre las 81 pruebas. La primera vez tarda 10–20 min porque descarga dependencias. **Docker Desktop debe estar abierto**: las pruebas de MySQL y Postgres usan contenedores.
- `mvnw.cmd spring-boot:run` levanta la app en http://localhost:8080. Se detiene con `Ctrl+C`.
- No clones dentro de OneDrive: la sincronización bloquea la carpeta `target`.

Datos de la app: base H2 en memoria. **Cada reinicio vuelve a los datos de ejemplo**, así que si una prueba deja datos dañados, basta con reiniciar.

---

## Herramientas por responsable

### OWASP ZAP (César)

Con la app corriendo, en **otra** terminal:

**PC propio (CMD):**
```cmd
cd /d C:\ITM\qa-petclinic-grupo4
mkdir evidencias\zap
docker run --rm -v "%cd%\evidencias\zap:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:8080 -r zap-baseline.html -J zap-baseline.json -I
```

**Codespaces (bash):**
```bash
mkdir -p evidencias/zap && chmod 777 evidencias/zap
docker run --rm --network host -v "$(pwd)/evidencias/zap:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:8080 -r zap-baseline.html -J zap-baseline.json -I
```

- `zap-baseline.py` hace un escaneo pasivo: arañea la app y revisa cabeceras y respuestas sin atacarla. Tarda pocos minutos.
- Para el escaneo activo, cambia `zap-baseline.py` por `zap-full-scan.py` y los nombres de los reportes por `zap-full.html` / `zap-full.json`. Tarda bastante más y **envía ataques reales a los formularios**, así que reinicia la app al terminar.
- `host.docker.internal` es como el contenedor de ZAP ve el `localhost` de Windows.
- `-I` evita que el comando termine en error cuando hay alertas, para que el reporte quede generado igual.
- Los reportes quedan en `evidencias/zap/`.

### Playwright (Valeria)

```bash
mkdir -p pruebas/e2e && cd pruebas/e2e
npm init playwright@latest
```
Elige TypeScript o JavaScript y deja `tests` como carpeta. En Codespaces ejecuta además `npx playwright install --with-deps chromium`. La URL base es `http://localhost:8080`.

### k6 – prueba de carga (Valeria)

Con un script `pruebas/carga/carga.js` que lea `__ENV.BASE_URL`:

**PC propio (CMD):**
```cmd
docker run --rm -i -e BASE_URL=http://host.docker.internal:8080 grafana/k6 run - < pruebas\carga\carga.js > evidencias\carga\k6-resultado.txt
```
**Codespaces (bash):**
```bash
docker run --rm -i --network host -e BASE_URL=http://localhost:8080 grafana/k6 run - < pruebas/carga/carga.js | tee evidencias/carga/k6-resultado.txt
```

### SonarQube (solo Camilo)

Corre en el PC de Camilo (`docker run -d --name sonarqube -p 9000:9000 sonarqube:community`). Los demás usan las capturas y los datos de `docs/HALLAZGOS-INICIALES.md`.

---

## Subir tus evidencias al repo

```cmd
git pull
git add evidencias pruebas
git commit -m "Evidencias <tu sección>: <qué subes>"
git push
```
Haz siempre `git pull` antes de empezar y antes de subir, para no pisar el trabajo de otro.

---

## Problemas que ya resolvimos (para no repetirlos)

| Síntoma | Causa | Solución |
|---|---|---|
| `error during connect ... dockerDesktopLinuxEngine` | Docker Desktop apagado | Abrirlo y esperar *Engine running* |
| `HTTP 000` en curl | La app no está corriendo | Levantarla en otra ventana con `spring-boot:run` |
| `No plugin found for prefix 'sonar'` | PetClinic no declara el plugin de Sonar | Llamarlo con nombre completo: `org.sonarsource.scanner.maven:sonar-maven-plugin:sonar` |
| `You're not authorized to analyze this project` | Clave de proyecto distinta a la del token | La clave es `qa-petclinic-grupo4` en minúscula |
| `ERROR ... CrashController` en el log de pruebas | Controlador que falla a propósito (demo de página de error) | No es un defecto; su prueba pasa |
