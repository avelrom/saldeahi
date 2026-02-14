![sal de ahí](public/og-image.png)

# sal de ahí

Directorio de instituciones públicas españolas y su presencia en redes sociales. Registra qué organismos siguen en X/Twitter y cuáles han abierto cuentas en alternativas federadas como Bluesky o Mastodon.

**→ [saldeahi.es](https://saldeahi.es)**

---

## Qué incluye

- Administración General del Estado (ministerios, organismos autónomos, empresas públicas)
- Gobierno de España (presidente y ministros)
- Congreso de los Diputados y Senado
- Comunidades autónomas (parlamentos, gobiernos y presidentes)
- Partidos políticos con representación parlamentaria
- Universidades públicas

---

## Desarrollo local

```bash
npm install
npm run dev
```

La web arranca en `http://localhost:4321`.

---

## Gestión de datos

Los datos viven en `datosfinales.xlsx` y se exportan a `src/data/*.json` mediante scripts de Python.

**Primera vez:**

```bash
npm run setup
```

Crea el entorno virtual `.venv` e instala las dependencias necesarias.

**Flujo habitual:**

```bash
# 1. Actualizar fechas de actividad en Bluesky y Mastodon (gratuito)
npm run check:free

# 2. Actualizar fechas de actividad en Twitter (requiere token de GetXAPI)
npm run check:twitter -- --token TU_API_KEY

# 3. Volcar el Excel a los archivos JSON que usa la web
npm run export
```

Los scripts `check:free` y `check:twitter` modifican directamente el Excel. `export` lee el Excel y sobreescribe los JSON en `src/data/`.

---

## Colaboración

Si detectas un dato incorrecto o que falta una cuenta, puedes proponer una corrección directamente desde la web: al pasar el ratón sobre cualquier fila de la tabla aparece un icono de bandera que abre un issue en GitHub con los datos actuales pre-rellenados.

También puedes [abrir un issue manualmente](https://github.com/avelrom/saldeahi/issues/new) si lo prefieres.

Los issues con el label `datos` son correcciones de contenido. Los que no tienen label son sugerencias o errores técnicos.

---

## Licencia

Los datos son de fuentes públicas. El código es MIT.
