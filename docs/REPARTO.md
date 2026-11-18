# Reparto del caso práctico final – Grupo 4

**Asignatura:** Aseguramiento de la Calidad – ITM · **Docente:** Carlos Andrés Jaramillo Patiño
**Sistema bajo prueba:** Spring PetClinic (fork en este repositorio)
**Entrega:** domingo 22 de noviembre de 2026, 11:59 p. m., PDF por la actividad de Teams

## Quién hace qué

| Integrante | Secciones del informe | Entregables concretos |
|---|---|---|
| **Camilo Ospina Hernández** | 1, 3 (tecnologías y ambiente), 11, 13 y consolidación | ✅ Montaje, línea base (81 pruebas) y SonarQube. ✅ Hallazgo DEF-01. Pendiente: KPIs SMART con semáforo, interpretación del dashboard de SonarQube, anexos, armado y exportación del PDF |
| **Maria Paulina Vargas Lenis** | 2, 3 (funcionalidad y arquitectura), 4, 5, 6 | Introducción; requisitos RF/RNF; criterios de aceptación; atributos de calidad; plan de pruebas (IEEE 829 / ISO 29119) con cronograma; **mínimo 10 casos manuales** con partición de equivalencia y valores límite; ejecución de sus casos con capturas |
| **César Augusto Barrientos** | 9, 10 | OWASP ZAP (baseline y full scan); análisis OWASP Top 10 integrando los resultados de SonarQube y ZAP (impacto y mitigación); registro en GitHub Issues de los defectos nuevos; ciclo de vida del DEF-01 |
| **Valeria García Ocampo** | 7 (rendimiento), 8 | **Mínimo 5 casos automatizados** con Playwright; integración CI/CD (GitHub Actions) o propuesta; prueba de carga o tiempo de respuesta con k6 |
| **Todos** | 12 | Cada uno escribe un párrafo con sus retos, problemas y aprendizajes. Camilo consolida |

## Fechas

| Fecha | Hito |
|---|---|
| Mié 18 nov | Paulina comparte los casos manuales diseñados (Valeria automatiza 5 de ellos). César corre el ZAP baseline |
| Jue 19 nov | Ejecución manual, automatización, k6 y ZAP full scan |
| Vie 20 nov (noche) | Cada uno deja su sección llena en la plantilla del informe (Teams) y sus evidencias en el repo |
| Sáb 21 nov | Camilo consolida, revisa coherencia y numeración de figuras |
| Dom 22 nov | Revisión final del grupo, exportar PDF y entregar con margen |

## Reglas para que el informe aguante la revisión

1. **Toda afirmación con evidencia**: captura, log o reporte guardado en `evidencias/` y citado en el informe.
2. **Nombres de evidencias**: `evidencias/<area>/<id>-<descripcion>.<ext>`, por ejemplo `evidencias/manuales/CP-03-telefono-9-digitos.png` o `evidencias/zap/zap-baseline.html`.
3. **Figuras** numeradas en orden: "Figura N. Descripción". Camilo renumera al consolidar.
4. **Mostrar la realidad**: probar caminos alternos y excepciones, no solo el camino feliz. Un caso fallido bien documentado vale más que uno maquillado.
5. **Nada de tokens ni contraseñas** en capturas, logs o commits.
6. **Separar lo medido de lo inferido**: "se midió…" o "se observó…" frente a "se infiere…" o "se recomienda…".

Cómo levantar el ambiente sin depender del PC de Camilo: ver `docs/COMO-CORRER.md`.
Resultados ya medidos para tomar como punto de partida: ver `docs/HALLAZGOS-INICIALES.md`.
