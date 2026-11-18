# Hallazgos iniciales (medidos el 17 de noviembre de 2026)

Ambiente: PC de Camilo (Windows, Docker Desktop 28.4, Java 21; la app arrancó con Java 24.0.1 por `JAVA_HOME`), commit base `500158f`. Responsable: Camilo Ospina Hernández.

## 1. Línea base de pruebas existentes

- Comando: `mvnw.cmd clean verify` → `evidencias/build-inicial.log`
- **81 pruebas, 0 fallos, 0 errores, 0 omitidas, BUILD SUCCESS.** Corrieron también las de integración con MySQL y Postgres (Testcontainers).
- Las líneas `ERROR ... CrashController` son intencionales: el controlador lanza una excepción para mostrar la página de error, y su prueba pasa.

## 2. SonarQube Community (primer análisis)

Log: `evidencias/sonar-inicial.log` · Capturas: `evidencias/capturas/sonar-*.png`

| Métrica | Valor medido | Rating |
|---|---|---|
| Líneas de código | 1,3 k (2,4 k líneas totales) | — |
| Quality Gate (*Sonar way*) | Passed | — |
| Security | 10 issues, todos **High** | **D** |
| Reliability (bugs) | 0 | A |
| Maintainability (code smells) | 3, todos **Blocker** | A |
| Cobertura | 90,8 % sobre 333 líneas a cubrir | — |
| Duplicación | 0,0 % | — |
| Security Hotspots | 0 (SonarQube los marca como obsoletos) | A |
| Deuda técnica | 2 h 10 min | — |

**Security – regla `java:S4684`** *"Database Operations should not be vulnerable to mass assignment"* (tags `cwe`, `spring`). Los controladores reciben la entidad JPA directamente desde el formulario en vez de un DTO.

| Archivo | Líneas |
|---|---|
| `owner/OwnerController.java` | 78, 95, 154 |
| `owner/PetController.java` | 101, 108 (×2), 145 (×2) |
| `owner/VisitController.java` | 98 (×2) |

**Maintainability – "Add at least one assertion to this test case"** (tags `junit`, `tests`). Pruebas que pasan sin verificar nada:
`MySqlIntegrationTests` L62 · `PetClinicIntegrationTests` L47 · `PostgresIntegrationTests` L82.

### Lecturas iniciales (inferidas, para desarrollar en las secciones 10 y 11)

1. **El Quality Gate pasa con Security D.** *Sonar way* solo evalúa el código nuevo y en un primer análisis todo es código existente. El semáforo verde no significa que el código sea seguro. Se recomienda un gate propio que exija Security ≥ B sobre el código completo.
2. **SonarQube Community no detecta inyección SQL ni XSS** (aviso en el propio dashboard). ZAP cubre ese punto ciego.
3. **81 pruebas en verde ≠ 81 verificaciones**: 3 pruebas de integración no tienen aserciones.
4. Mapeo OWASP de S4684: CWE-915 → **A08 Software and Data Integrity Failures** (por confirmar con el filtro *Compliance category → OWASP Top 10* de SonarQube).

## 3. DEF-01 – Asignación masiva confirmada (GitHub Issue #1)

Causa: `OwnerController` vincula la entidad `Owner` directamente y su `@InitBinder` solo bloquea `id` y `*.id`, así que los campos anidados `pets[...]` quedan expuestos.

| Paso | Petición | Resultado medido | Evidencia |
|---|---|---|---|
| Antes | `GET /owners/1` | Leo nació el `2010-09-07` | `evidencias/mass-assignment-antes.html` |
| Ataque | `POST /owners/1/edit` con datos normales del dueño + `pets[0].birthDate=2099-01-01` | **HTTP 302** (aceptado) | — |
| Después | `GET /owners/1` | Leo aparece nacido el **`2099-01-01`** | `evidencias/mass-assignment-despues.html`, `evidencias/capturas/defecto-01-leo-2099.png` |
| Control | `POST /owners/1/pets/1/edit` con `birthDate=2099-01-01` | **HTTP 200 + "invalid date"** (rechazado) | `evidencias/control-pet-form.html`, `evidencias/capturas/defecto-01-control.png` |

Conclusión: la regla "fecha de nacimiento no futura" existe en el formulario de mascota, pero el formulario de dueño permite saltársela. Como la app no tiene autenticación, cualquier visitante puede hacerlo.
Severidad Alta · Prioridad Alta · Mitigación propuesta: DTO de formulario o lista blanca `setAllowedFields("firstName", "lastName", "address", "city", "telephone")`.

## 4. Reglas de negocio verificadas en el código (insumo para los casos de Paulina)

| Entidad | Campo | Regla | Dónde |
|---|---|---|---|
| Owner | firstName, lastName | Obligatorios | `Person.java` (`@NotBlank`) |
| Owner | address | Obligatorio, máx. 255 caracteres | `Owner.java` |
| Owner | city | Obligatorio, máx. 80 caracteres | `Owner.java` |
| Owner | telephone | Obligatorio, **exactamente 10 dígitos** (`\d{10}`) | `Owner.java` |
| Pet | name | Obligatorio, **máx. 30 caracteres**; no repetido para el mismo dueño ("is already in use") | `PetValidator.java`, `PetController.java` |
| Pet | birthDate | Obligatoria y no puede ser futura ("invalid date") | `PetValidator.java`, `PetController.java` |
| Pet | type | Obligatorio al crear | `PetValidator.java` |
| Visit | description | Obligatoria | `Visit.java` |
| Find Owners | lastName | Vacío lista todos (paginado); sin resultados → "not found"; un solo resultado → abre el dueño directo; página fuera de rango → vuelve a la página 1 | `OwnerController.java` |
