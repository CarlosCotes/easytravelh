# Manual del programador

## 1. Arquitectura

Aplicación de páginas estáticas con HTML semántico, CSS y un único módulo JavaScript (`js/app.js`). No existe backend, base de datos remota, proceso de compilación ni secreto de API. El navegador solicita datos a servicios públicos y conserva las elecciones del usuario con `localStorage`.

## 2. Estructura del repositorio

- `index.html`: inicio.
- `explorar.html`: explorador de países.
- `destino.html`: ficha seleccionada por el parámetro `?country=ISO3`.
- `favoritos.html` y `favoritos-vacio.html`: entrada a la lista persistida.
- `itinerario.html`: gestión de viajes.
- `acerca.html`: descripción e integraciones.
- `css/tokens.css`: variables de marca y tipografía.
- `css/base.css`, `components.css`, `layout.css`, `pages.css`: reglas generales y diseño original.
- `css/app.css`: estilos de módulos funcionales.
- `js/app.js`: datos, peticiones, estado, plantillas y eventos.
- `img/`, `fonts/`: iconos, favicon y tipografías.
- `docs/`: estas guías y sus capturas.
- `.github/workflows/pages.yml`: publicación estática automática en GitHub Pages.

## 3. Inicio y navegación por página

El script usa el nombre del archivo actual para escoger el módulo (`explorar.html`, `destino.html`, etc.) y renderiza el contenido dentro de `main#contenido`. La cabecera, navegación y pie permanecen en el HTML de cada página. Las acciones comunes usan delegación de eventos, por lo que los botones continúan funcionando cuando se vuelve a dibujar una tarjeta.

## 4. Integración REST Countries y Nominatim

La constante `API` apunta a `https://restcountries.com/v3.1`. `loadCountries()` solicita a `/all` los campos usados por las vistas y ordena el resultado por nombre. Si la consulta falla, carga `data/countries.json`. `renderCountries()` combina búsqueda de nombre/capital y filtro de región; en favoritos usa la lista persistida. `card()` convierte cada país en una tarjeta y enlaza al detalle usando su código ISO alpha‑3 (`cca3`). Los adaptadores `name`, `code`, `capital`, `langs` y `currency` unifican las formas de los datos.

La ficha obtiene el país seleccionado con `/alpha/{ISO3}` y campos delimitados; si falla, busca el código ISO en el catálogo local. Para localizar la capital, `renderDetail()` consulta Nominatim en `nominatim.openstreetmap.org/search`, limitando la búsqueda al código ISO de dos letras del país. Si la búsqueda falla, usa `capitalInfo.latlng` o, como respaldo, `latlng` del país. El pronóstico consulta esas coordenadas mediante Open‑Meteo Forecast. Si no hay conexión al servicio meteorológico, se conserva la ficha y se muestra un aviso en el panel del clima.

**Nota de mantenimiento:** REST Countries retiró v3.1 y su API v5 actual requiere una clave. `data/countries.json` permite que el módulo siga funcionando hoy. Para activar consultas REST Countries v5 en la versión pública, se debe crear un backend o función serverless que use la clave del lado del servidor; no se debe incluir esa clave en `js/app.js` ni en archivos servidos al navegador.

## 5. Integración Open‑Meteo

En `renderDetail()`, las coordenadas encontradas se interpolan en la consulta `https://api.open-meteo.com/v1/forecast`. Se solicitan variables actuales y máximas/mínimas diarias para cinco días, junto con zona horaria automática. `weatherDescription()` traduce los códigos WMO más habituales y la plantilla presenta el resultado.

No se envían claves. Un error de red o ausencia de coordenadas no invalida el resto de la ficha.

## 6. Persistencia y estado

Las claves versionadas son `easytravel.favorites.v1` y `easytravel.trips.v1`. `get()` recupera JSON con tolerancia a datos inválidos; `set()` serializa cada actualización. Los favoritos se comparan mediante `cca3` para impedir duplicados. Los planes incluyen actividades en una lista asociada.

`localStorage` pertenece al origen y perfil del navegador: los datos no se comparten entre usuarios, equipos o dispositivos. No guardar información sensible aquí.

## 7. Formularios y seguridad de interfaz

El navegador valida campos requeridos, límites y tipo de fecha/número. El manejador de envío compara las fechas antes de persistir. `esc()` codifica caracteres HTML en datos de APIs y datos escritos por usuarios antes de insertar contenido en plantillas. Enlaces externos abren en otra pestaña con `rel="noopener"`.

## 8. Estilos y accesibilidad

`app.css` usa clases con prefijo `app-`, rejillas adaptables, controles etiquetados, estados de carga/error, `aria-live` para el conteo y mensajes con `role="status"`/`role="alert"`. Los estilos generales y breakpoints de la interfaz original permanecen en la carpeta `css/`.

## 9. Cambios y despliegue

No hay dependencias npm. Para desarrollo basta con servir la carpeta raíz mediante un servidor estático. El workflow de Pages adjunta la raíz del repositorio como artefacto y la publica al actualizar la rama principal; en la configuración del repositorio hay que habilitar Pages con fuente **GitHub Actions**.

Para añadir una API, crear una función `async` con `fetch`, validar `response.ok`, manejar errores y limitar los datos procesados. Mantener cualquier clave privada fuera del frontend: todo valor distribuido en JavaScript queda visible para el visitante.
