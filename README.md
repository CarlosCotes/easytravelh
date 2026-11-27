# easytravel · Planify

Aplicación web frontend responsive para explorar países, consultar el clima de sus capitales, guardar destinos e idear itinerarios. Está construida con HTML, CSS y JavaScript nativo; no requiere servidor de aplicación ni claves privadas.

## Funciones

- Búsqueda por país o capital y filtro por región.
- Ficha dinámica del país con bandera, capital, población, idiomas, moneda, zona horaria y coordenadas.
- Clima actual y pronóstico de cinco días para las coordenadas de la capital.
- Favoritos sin duplicados y exportación de la lista en JSON.
- Creación y eliminación de itinerarios, con fechas, destino, viajeros, presupuesto, comentarios y actividades.
- Persistencia local mediante `localStorage`.
- Interfaz responsive para escritorio y móvil.

## APIs

- **REST Countries**: países e información geográfica y cultural. `https://restcountries.com/v3.1`
- **Nominatim / OpenStreetMap**: busca las coordenadas de la capital. `https://nominatim.openstreetmap.org/search`
- **Open‑Meteo Forecast**: consulta el clima actual y el pronóstico. `https://api.open-meteo.com/v1/forecast`

La exploración consulta REST Countries y utiliza `data/countries.json` si el servicio no está disponible. En el detalle, Nominatim obtiene las coordenadas de la capital y Open‑Meteo consulta el clima. Favoritos e itinerarios permanecen en el almacenamiento local del navegador y no se sincronizan entre equipos.

> **Estado de REST Countries (noviembre de 2026):** el endpoint v3.1 indicado en el planteamiento está retirado por su proveedor. La app conserva el catálogo local para que la exploración y las fichas sigan disponibles. La versión v5 actual requiere una clave; para conectarla en una web pública se necesita un servicio backend que resguarde esa clave.

## Organización

- HTML en la raíz: una página por módulo.
- `css/`: tokens, componentes, layouts, páginas y estilos de la aplicación.
- `js/app.js`: estado, peticiones, renderizado y eventos.
- `img/` y `fonts/`: recursos visuales locales.
- `docs/`: manual del usuario y manual del programador.

## Uso local

Sirve la carpeta raíz con cualquier servidor estático (por ejemplo, **Live Server** de VS Code). No hay pasos de compilación ni dependencias de instalación; el servidor local permite que funcione el catálogo de respaldo.

## Publicación

El sitio puede alojarse en GitHub Pages, Netlify o un servicio estático equivalente. En GitHub Pages configura la fuente de publicación como **GitHub Actions**. El workflow `.github/workflows/pages.yml` publica la raíz del repositorio en cada cambio de la rama principal.

## Guías

- [Manual del usuario](docs/manual-usuario.md)
- [Manual del programador](docs/manual-programador.md)
