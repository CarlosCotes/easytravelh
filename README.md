# easytravel — versión HTML y CSS

> Tu viaje, en un solo lugar.

Maquetación completa de **easytravel** hecha solo con **HTML5 y CSS3**, sin frameworks ni JavaScript. Es la versión estática de las pantallas del prototipo en Figma: los datos son de ejemplo y las acciones (buscar, filtrar, guardar) todavía no tienen lógica.

## Páginas

| Archivo | Pantalla |
| --- | --- |
| `index.html` | Inicio: buscador, destinos destacados, cómo funciona y llamado a la acción |
| `explorar.html` | Explorador con buscador, filtros por región, orden, tarjetas y paginación |
| `destino.html` | Ficha de un destino (España): datos, mapa, clima actual, pronóstico y "Añadir a un plan" |
| `favoritos.html` | Destinos guardados, filtros, aviso de duplicado (`#aviso-duplicado`) y confirmación para vaciar (`#confirmar-vaciar`) |
| `favoritos-vacio.html` | Estado vacío de favoritos |
| `itinerario.html` | Planes, días con actividades, resumen y formulario de planificación (`#nuevo-plan`) |
| `acerca.html` | Qué es easytravel y qué se puede hacer |
| `404.html` | Página no encontrada |

## Técnicas de CSS usadas

- **Variables CSS** (`css/tokens.css`) para colores, tipografía y medidas.
- **Tema oscuro automático** con `@media (prefers-color-scheme: dark)`: cambia solo las variables.
- **Mobile-first** con media queries en 640 px, 768 px y 1024 px. Diseño de 390 px a 1440 px.
- **Flexbox y CSS Grid** para todos los layouts.
- **Modales sin JavaScript** con la pseudo-clase `:target` (se abren con un enlace a `#id`).
- **Pestañas de días en móvil** con radio buttons y `:checked`.
- **Validación visual** con `:user-invalid` y atributos `required`, `min`, `max`, `pattern`.
- **Íconos SVG** aplicados con `mask` para que tomen el color del texto.
- **Accesibilidad**: HTML semántico, `aria-label`, `aria-current`, enlace "Saltar al contenido", foco visible y contraste AA.

## Estructura

```
easytravelHTML/
├── index.html, explorar.html, destino.html, favoritos.html,
│   favoritos-vacio.html, itinerario.html, acerca.html, 404.html
├── css/
│   ├── tokens.css      Fuentes y variables de diseño (tema claro y oscuro)
│   ├── base.css        Reinicio, tipografía y utilidades
│   ├── components.css  Botones, badges, tarjetas, formularios, alertas, modal
│   ├── layout.css      Header, footer, barra de pestañas móvil, encabezado de página
│   └── pages.css       Estilos propios de cada página
├── fonts/              Outfit e Inter
└── img/                Favicon e íconos SVG
```

## Cómo verlo

Abre `index.html` en el navegador. No necesita instalar nada.

## Despliegue

Se puede publicar tal cual en Netlify (arrastrando la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop) o conectando el repositorio) o en GitHub Pages. No requiere comando de build.
