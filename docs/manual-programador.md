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

## 4. Integración REST Countries

La constante `API` apunta a `https://restcountries.com/v3.1`. `loadCountries()` solicita los campos estrictamente necesarios y ordena el resultado por nombre. `renderCountries()` combina búsqueda de nombre/capital, filtro de región y, en favoritos, la lista local. `card()` transforma un país recibido en una tarjeta y forma la ruta a detalle usando `cca3`.

La ficha obtiene el país seleccionado con `/alpha/{ISO3}`. Para el clima usa primero `capitalInfo.latlng` y recurre a `latlng` si el dato de capital no está disponible.

## 5. Integración Open‑Meteo

En `renderDetail()`, la latitud y longitud se interpolan en la consulta `https://api.open-meteo.com/v1/forecast`. Se solicitan variables actuales y máximas/mínimas diarias para cinco días, junto con zona horaria automática. `weatherDescription()` traduce los códigos WMO más habituales y la plantilla presenta el resultado.

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
