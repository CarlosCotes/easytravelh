# Manual del usuario

> Guía funcional completa. Las capturas de pantalla se deben añadir al habilitar la vista web; este entorno no pudo abrir la vista previa local para capturar la interfaz.

## 1. Abrir la aplicación

Entra a la dirección web publicada o abre `index.html` si recibiste la carpeta del proyecto. Las consultas a países y clima requieren conexión a Internet. Los favoritos e itinerarios se guardan únicamente en el navegador y el dispositivo donde los creaste.

## 2. Página de inicio

La página de inicio explica el flujo y ofrece un buscador. Escribe un país o ciudad y pulsa **Explorar destinos**. También puedes entrar desde el menú a **Explorar destinos**.

## 3. Explorar y filtrar países

La lista se carga desde REST Countries. En **Buscar país o capital** escribe, por ejemplo, “Colombia” o “Bogotá”. El menú **Región** permite limitar la lista por continente. Cada tarjeta presenta bandera, nombre, región, capital y población.

Pulsa **Ver detalles** para abrir la ficha. El corazón o el botón **Favorito** guarda o quita el país. La búsqueda no distingue mayúsculas y minúsculas.

## 4. Consultar una ficha y el clima

La ficha se abre al seleccionar **Ver detalles**. Allí puedes revisar datos del país, abrir sus coordenadas en OpenStreetMap y guardar el destino. En la sección de clima se consulta Open‑Meteo para las coordenadas de la capital: temperatura, sensación térmica, viento, humedad, precipitación y pronóstico de cinco días.

Si el país no tiene coordenadas de capital o la API no está disponible, los demás datos siguen siendo consultables y aparecerá un mensaje en el bloque del clima. Pulsa **Volver a explorar** para regresar.

## 5. Gestionar favoritos

Abre **Favoritos** desde el menú. Puedes buscar dentro de la lista, quitar destinos con el botón de favorito y descargar una copia JSON con **Exportar lista**. La lista evita duplicados por código de país.

## 6. Crear y administrar itinerarios

Abre **Mi itinerario** y completa el formulario: nombre, destino, fechas, viajeros y, de forma opcional, presupuesto y comentarios. Los campos requeridos se validan antes de guardar y la fecha final no puede preceder a la inicial.

En una tarjeta de itinerario agrega actividades usando el campo inferior. Puedes eliminar actividades individuales o borrar el itinerario. Los datos se guardan en el almacenamiento local del navegador.

## 7. Si algo no carga

- Confirma que el dispositivo tenga Internet y vuelve a cargar la página.
- La consulta de destinos muestra **Reintentar** cuando REST Countries falla.
- Los servicios públicos pueden tener límites o interrupciones temporales.
- Si borras los datos del sitio en el navegador, perderás los favoritos e itinerarios guardados allí. Exporta tus favoritos antes de cambiar de dispositivo.
