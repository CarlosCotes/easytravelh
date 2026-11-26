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

- **REST Countries v3.1**: países e información geográfica y cultural. `https://restcountries.com/v3.1`
- **Open-Meteo Forecast**: clima actual y pronóstico. `https://api.open-meteo.com/v1/forecast`
- **OpenStreetMap**: abre coordenadas de la capital en el mapa público. No se usa el servicio de teselas como API de datos.

Las APIs se consumen directamente desde el navegador. Se necesita conexión a Internet para consultar y actualizar sus datos. Favoritos e itinerarios permanecen en el almacenamiento local del navegador y no se sincronizan entre equipos.

## Organización

- HTML en la raíz: una página por módulo.
- `css/`: tokens, componentes, layouts, páginas y estilos de la aplicación.
- `js/app.js`: estado, peticiones, renderizado y eventos.
- `img/` y `fonts/`: recursos visuales locales.
- `docs/`: manual del usuario y manual del programador.

## Uso local

Abre `index.html` o sirve la carpeta con cualquier servidor de archivos estáticos. No hay pasos de compilación ni dependencias de instalación.

## Publicación

El sitio puede alojarse en GitHub Pages, Netlify o un servicio estático equivalente. En GitHub Pages configura la fuente de publicación como **GitHub Actions**. El workflow `.github/workflows/pages.yml` publica la raíz del repositorio en cada cambio de la rama principal.

## Guías

- [Manual del usuario](docs/manual-usuario.md)
- [Manual del programador](docs/manual-programador.md)

