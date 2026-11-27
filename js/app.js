/* Planify / easytravel: aplicación frontend sin servidor. */
(() => {
  const API = 'https://restcountries.com/v3.1';
  const KEYS = { favorites: 'easytravel.favorites.v1', trips: 'easytravel.trips.v1' };
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const name = c => c?.name?.common || c?.name || 'Destino';
  const code = c => c?.cca3 || c?.alpha3Code || c?.code || '';
  const capital = c => (Array.isArray(c?.capital) ? c.capital[0] : c?.capital) || 'Sin capital registrada';
  const population = c => Number(c?.population || 0).toLocaleString('es-CO');
  const flag = c => c?.flags?.svg || c?.flag || '';
  const region = c => c?.region || 'Otra región';
  const regionLabel = value => ({Americas:'Américas',Europe:'Europa',Asia:'Asia',Africa:'África',Oceania:'Oceanía',Antarctic:'Antártida'}[value] || value || 'Otra región');
  const langs = c => (Array.isArray(c?.languages) ? c.languages.map(x => x.name) : Object.values(c?.languages || {})).filter(Boolean).join(', ') || 'No disponible';
  const currency = c => (Array.isArray(c?.currencies) ? c.currencies : Object.values(c?.currencies || {})).map(x => `${x.name || x.code || ''}${x.symbol ? ` (${x.symbol})` : ''}`).filter(Boolean).join(', ') || 'No disponible';
  const favorites = () => get(KEYS.favorites);
  const trips = () => get(KEYS.trips);
  const title = document.title.split(' · ')[0];
  const page = location.pathname.split('/').pop() || 'index.html';
  let countries = [];

  function setCount() {
    document.querySelectorAll('.contador').forEach(el => el.textContent = favorites().length);
    document.querySelectorAll('.cabecera-sitio__acciones .boton-icono').forEach(el => el.setAttribute('aria-label', `Favoritos, ${favorites().length} guardados`));
  }
  function toast(message) {
    let el = $('#app-toast');
    if (!el) { el = document.createElement('div'); el.id = 'app-toast'; el.className = 'app-toast'; el.setAttribute('role','status'); document.body.append(el); }
    el.textContent = message; el.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 2600);
  }
  function card(c) {
    const id = code(c), saved = favorites().some(x => code(x) === id);
    return `<article class="app-card"><div class="app-card__flag">${flag(c) ? `<img src="${esc(flag(c))}" alt="Bandera de ${esc(name(c))}" loading="lazy">` : '🌍'}<button class="app-heart ${saved?'saved':''}" data-action="favorite" data-code="${esc(id)}" aria-label="${saved?'Quitar':'Agregar'} ${esc(name(c))} ${saved?'de':'a'} favoritos" aria-pressed="${saved}">${saved?'♥':'♡'}</button></div><div class="app-card__body"><p class="app-kicker">${esc(regionLabel(region(c)))}${c.subregion?` · ${esc(c.subregion)}`:''}</p><h2>${esc(name(c))}</h2><p>Capital: ${esc(capital(c))}</p><p>Población: ${population(c)}</p><div class="app-actions"><a class="boton boton--sm boton--primario" href="destino.html?country=${encodeURIComponent(id)}">Ver detalles</a><button class="boton boton--sm boton--contorno" data-action="favorite" data-code="${esc(id)}">${saved?'Guardado':'♡ Favorito'}</button></div></div></article>`;
  }
  function shell(content, heading = '') {
    const main = $('#contenido');
    main.innerHTML = `<div class="app-wrap">${heading?`<div class="app-heading"><p class="app-kicker">PLANIFICA A TU MANERA</p><h1>${heading}</h1></div>`:''}${content}</div>`;
  }
  async function loadCountries() {
    const container = $('[data-country-results]'); if (!container) return;
    container.innerHTML = '<p class="app-status">Cargando destinos…</p>';
    try {
      try {
        const response = await fetch(`${API}/all?fields=name,cca3,cca2,capital,region,subregion,population,flags,languages,currencies,capitalInfo,latlng,maps,timezones`);
        if (!response.ok) throw new Error('No fue posible consultar el servicio de destinos.');
        countries = await response.json();
        if (!Array.isArray(countries)) throw new Error('El servicio devolvió una respuesta inesperada.');
      } catch {
        const response = await fetch('data/countries.json');
        if (!response.ok) throw new Error('No se pudo cargar la lista local de destinos.');
        countries = await response.json();
        toast('Mostrando la lista local de destinos.');
      }
      countries = countries.filter(c => c.name).sort((a,b) => name(a).localeCompare(name(b),'es'));
      renderCountries();
    } catch (error) { container.innerHTML = `<div class="app-status app-error">${esc(error.message)} Revisa que la app esté abierta desde su servidor local y vuelve a intentar. <button class="boton boton--sm boton--contorno" data-action="reload">Reintentar</button></div>`; }
  }
  function renderCountries() {
    const container = $('[data-country-results]'); if (!container) return;
    const query = ($('#country-search')?.value || '').trim().toLocaleLowerCase('es');
    const selectedRegion = $('#region-filter')?.value || '';
    const onlySaved = container.dataset.countryResults === 'favorites';
    const source = onlySaved ? favorites() : countries;
    const results = source.filter(c => (!query || `${name(c)} ${capital(c)} ${region(c)}`.toLocaleLowerCase('es').includes(query)) && (!selectedRegion || region(c) === selectedRegion));
    $('#result-count') && ($('#result-count').textContent = `${results.length} destinos`);
    container.innerHTML = results.length ? results.slice(0, 120).map(card).join('') : `<div class="app-status">${onlySaved?'Todavía no tienes favoritos. Explora destinos y guárdalos aquí.':'No encontramos destinos con esos filtros.'}</div>`;
  }
  function renderExplore() {
    shell(`<div class="app-toolbar"><label class="app-field">Buscar país o capital<input id="country-search" type="search" placeholder="Ej. Colombia, Tokio…" autocomplete="off"></label><label class="app-field">Región<select id="region-filter"><option value="">Todas las regiones</option><option value="Americas">Américas</option><option value="Europe">Europa</option><option value="Asia">Asia</option><option value="Africa">África</option><option value="Oceania">Oceanía</option></select></label><p id="result-count" class="app-kicker" aria-live="polite"></p></div><div data-country-results="all" class="app-grid"></div>`, 'Explora destinos');
    const q = new URLSearchParams(location.search).get('q'); if (q) $('#country-search').value = q;
    loadCountries();
  }
  function renderFavorites() {
    shell(`<div class="app-toolbar"><label class="app-field">Filtrar tus favoritos<input id="country-search" type="search" placeholder="Buscar por país o capital…"></label><button class="boton boton--contorno" data-action="export-favorites">Exportar lista</button></div><div data-country-results="favorites" class="app-grid"></div>`, 'Tus destinos favoritos');
    renderCountries();
  }
  function weatherDescription(code) {
    if (code === 0) return 'Despejado'; if ([1,2,3].includes(code)) return 'Parcialmente nublado';
    if ([45,48].includes(code)) return 'Niebla'; if ([51,53,55,61,63,65,80,81,82].includes(code)) return 'Lluvia';
    if ([71,73,75,77,85,86].includes(code)) return 'Nieve'; if ([95,96,99].includes(code)) return 'Tormenta'; return 'Variable';
  }
  async function renderDetail() {
    const id = new URLSearchParams(location.search).get('country') || 'ESP';
    shell('<p class="app-status">Consultando país y clima…</p>');
    try {
      let c;
      try {
        const response = await fetch(`${API}/alpha/${encodeURIComponent(id)}?fields=name,cca3,cca2,capital,region,subregion,population,flags,languages,currencies,capitalInfo,latlng,maps,timezones`);
        if (!response.ok) throw new Error('No fue posible consultar el destino.');
        const data = await response.json(); c = Array.isArray(data) ? data[0] : data;
      } catch {
        const localResponse = await fetch('data/countries.json');
        const localCountries = localResponse.ok ? await localResponse.json() : [];
        c = localCountries.find(country => code(country) === id);
        if (!c) throw new Error('Destino no encontrado.');
        toast('Mostrando datos locales del destino.');
      }
      const saved = favorites().some(x => code(x) === code(c));
      const coords = c.capitalInfo?.latlng || c.latlng;
      let weatherCoords = coords;
      const countryCode = c.alpha2Code || c.cca2;
      if (countryCode && capital(c) !== 'Sin capital registrada') {
        try {
          const query = new URLSearchParams({city:capital(c),countrycodes:countryCode.toLowerCase(),format:'jsonv2',limit:'5'});
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
          const places = geoResponse.ok ? await geoResponse.json() : [];
          const place = places[0];
          if (place) weatherCoords = [Number(place.lat),Number(place.lon)];
        } catch { /* Conserva las coordenadas del país si falla la búsqueda de capital. */ }
      }
      let climate = '<p class="app-status">No hay coordenadas suficientes para consultar el clima.</p>';
      if (weatherCoords?.length >= 2) {
        try {
          const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${weatherCoords[0]}&longitude=${weatherCoords[1]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=auto`);
          if (w.ok) { const j = await w.json(); climate = `<div class="app-weather"><div><span class="app-kicker">${esc(capital(c))} AHORA</span><strong>${Math.round(j.current.temperature_2m)}°C</strong><p>${weatherDescription(j.current.weather_code)} · sensación ${Math.round(j.current.apparent_temperature)}°C</p></div><p>Viento: ${Math.round(j.current.wind_speed_10m)} km/h<br>Humedad: ${j.current.relative_humidity_2m}%<br>Precipitación: ${j.current.precipitation} mm</p></div><div class="app-forecast">${j.daily.time.map((day,i)=>`<div><strong>${new Date(`${day}T12:00:00`).toLocaleDateString('es-CO',{weekday:'short',day:'numeric'})}</strong><span>${weatherDescription(j.daily.weather_code[i])}</span><b>${Math.round(j.daily.temperature_2m_max[i])}° / ${Math.round(j.daily.temperature_2m_min[i])}°</b><small>Lluvia ${j.daily.precipitation_probability_max?.[i] ?? '—'}%</small></div>`).join('')}</div>`; }
        } catch { climate = '<p class="app-status">No se pudo consultar el clima. La información del país sigue disponible.</p>'; }
      }
      const main = $('#contenido');
      main.innerHTML = `<div class="app-wrap"><a href="explorar.html" class="app-back">← Volver a explorar</a><section class="app-detail-head">${flag(c)?`<img src="${esc(flag(c))}" alt="Bandera de ${esc(name(c))}">`:''}<div><p class="app-kicker">${esc(region(c))}${c.subregion?` · ${esc(c.subregion)}`:''}</p><h1>${esc(name(c))}</h1><p>Capital: ${esc(capital(c))}</p></div><button class="boton ${saved?'boton--contorno':'boton--primario'}" data-action="favorite" data-code="${esc(code(c))}">${saved?'♥ En favoritos':'♡ Agregar a favoritos'}</button></section><div class="app-detail-grid"><section class="app-panel"><h2>Información general</h2><dl class="app-facts"><div><dt>Población</dt><dd>${population(c)}</dd></div><div><dt>Idiomas</dt><dd>${esc(langs(c))}</dd></div><div><dt>Moneda</dt><dd>${esc(currency(c))}</dd></div><div><dt>Zona horaria</dt><dd>${esc(c.timezones?.[0] || 'No disponible')}</dd></div><div><dt>Coordenadas</dt><dd>${coords?coords.map(n=>Number(n).toFixed(2)).join(', '):'No disponible'}</dd></div><div><dt>Región</dt><dd>${esc(c.subregion || region(c))}</dd></div></dl>${coords?`<a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}#map=6/${coords[0]}/${coords[1]}">Ver ubicación en OpenStreetMap ↗</a>`:''}</section><section class="app-panel"><h2>Clima en ${esc(capital(c))}</h2>${climate}<p class="app-attribution">Pronóstico consultado en Open‑Meteo según las coordenadas de la capital.</p></section></div></div>`;
      document.title = `${name(c)} · easytravel`;
    } catch (error) { shell(`<div class="app-status app-error">${esc(error.message)} <a href="explorar.html">Volver a explorar destinos</a></div>`); }
  }
  function renderHome() {
    shell(`<section class="app-hero"><p class="app-kicker">TU PRÓXIMA AVENTURA EMPIEZA AQUÍ</p><h1>Planea tu viaje en un solo lugar</h1><p>Explora países, revisa el clima y organiza las ideas de tu próximo viaje.</p><form id="home-search" class="app-search"><input name="q" type="search" placeholder="¿A dónde quieres ir?" aria-label="Buscar destino"><button class="boton boton--primario">Explorar destinos</button></form></section><section class="app-home-section"><div class="app-section-head"><div><p class="app-kicker">INSPIRACIÓN PARA VIAJAR</p><h2>Destinos populares</h2></div><a href="explorar.html">Ver todos →</a></div><div class="app-grid" data-featured></div></section><section class="app-home-section app-steps"><h2>Tu viaje, paso a paso</h2><div><article><b>1</b><h3>Explora</h3><p>Busca países, capitales y banderas con REST Countries.</p></article><article><b>2</b><h3>Guarda</h3><p>Arma tu lista de favoritos, disponible en este navegador.</p></article><article><b>3</b><h3>Planifica</h3><p>Crea un itinerario y agrega actividades para cada día.</p></article></div></section>`, '');
    const form = $('#home-search'); form?.addEventListener('submit', e => { e.preventDefault(); location.href = `explorar.html?actualizacion=3&q=${encodeURIComponent(form.q.value)}`; });
    const fav = favorites(); const picks = fav.length ? fav.slice(0,4) : [{cca3:'COL',name:{common:'Colombia'},capital:['Bogotá'],region:'Americas',flags:{svg:'https://flagcdn.com/co.svg'},population:52000000},{cca3:'ESP',name:{common:'España'},capital:['Madrid'],region:'Europe',flags:{svg:'https://flagcdn.com/es.svg'},population:48000000},{cca3:'JPN',name:{common:'Japón'},capital:['Tokio'],region:'Asia',flags:{svg:'https://flagcdn.com/jp.svg'},population:124000000},{cca3:'ITA',name:{common:'Italia'},capital:['Roma'],region:'Europe',flags:{svg:'https://flagcdn.com/it.svg'},population:59000000}];
    $('[data-featured]').innerHTML = picks.map(card).join('');
    const q = new URLSearchParams(location.search).get('q'); if (q) { form.q.value = q; }
  }
  const dateLabel = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'}) : 'Fecha por definir';
  function renderTrips() {
    const list = trips();
    shell(`<div class="app-trips">${list.length?list.map((t,i)=>`<article class="app-trip"><div class="app-section-head"><div><p class="app-kicker">${esc(t.destination)}</p><h2>${esc(t.name)}</h2><p>${dateLabel(t.start)} – ${dateLabel(t.end)} · ${t.travelers} viajero(s)</p></div><button class="boton boton--contorno" data-action="delete-trip" data-index="${i}">Eliminar</button></div><p>${esc(t.notes || '')}</p><ul class="app-activities">${(t.activities||[]).map((a,j)=>`<li>${esc(a)} <button data-action="delete-activity" data-trip="${i}" data-index="${j}" aria-label="Eliminar actividad">×</button></li>`).join('')}</ul><form class="app-activity-form" data-trip="${i}"><input name="activity" required maxlength="120" placeholder="Agregar una actividad"><button class="boton boton--sm boton--primario">Agregar</button></form></article>`).join(''):'<div class="app-status">Aún no tienes itinerarios. Crea uno para organizar tu viaje.</div>'}<section class="app-panel" id="nuevo-plan"><h2>Crear un plan de viaje</h2><form id="trip-form" class="app-form"><label class="app-field">Nombre del viaje<input name="name" required maxlength="70" placeholder="Ej. Vacaciones de verano"></label><label class="app-field">Destino<input name="destination" required maxlength="70" placeholder="Ciudad o país"></label><label class="app-field">Fecha de inicio<input name="start" type="date" required></label><label class="app-field">Fecha de finalización<input name="end" type="date" required></label><label class="app-field">Número de viajeros<input name="travelers" type="number" min="1" max="30" value="1" required></label><label class="app-field">Presupuesto estimado<input name="budget" type="number" min="0" step="1000" placeholder="COP"></label><label class="app-field app-field--wide">Comentarios<textarea name="notes" rows="3" maxlength="500" placeholder="Ideas o detalles del viaje"></textarea></label><button class="boton boton--primario">Guardar itinerario</button><p id="form-feedback" role="alert"></p></form></section></div>`, 'Mi itinerario');
    const form = $('#trip-form'); form.start.min = new Date().toISOString().slice(0,10);
    form.addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(form)); if (d.end < d.start) { $('#form-feedback').textContent = 'La fecha final debe ser igual o posterior a la fecha inicial.'; form.end.focus(); return; } const current = trips(); current.unshift({...d, travelers:Number(d.travelers),budget:Number(d.budget||0),activities:[]}); set(KEYS.trips,current); renderTrips(); toast('Itinerario guardado en este navegador.'); });
  }
  function renderAbout() {
    shell(`<section class="app-panel"><h2>Planifica con información conectada</h2><p>easytravel reúne exploración de países, consulta del clima, favoritos e itinerarios en una aplicación web.</p><div class="app-detail-grid"><article><h3>REST Countries</h3><p>Países, capitales, banderas, región, idiomas, monedas y coordenadas.</p><a href="https://restcountries.com/" target="_blank" rel="noopener">API ↗</a></article><article><h3>Open‑Meteo</h3><p>Temperatura actual, sensación térmica, viento y pronóstico de cinco días para la capital.</p><a href="https://open-meteo.com/" target="_blank" rel="noopener">Documentación ↗</a></article><article><h3>Nominatim / OpenStreetMap</h3><p>Busca la capital y obtiene sus coordenadas para consultar el clima.</p><a href="https://nominatim.org/release-docs/latest/api/Search/" target="_blank" rel="noopener">Documentación ↗</a></article></div><h3>Privacidad y almacenamiento</h3><p>Los favoritos y planes se guardan en localStorage dentro de este navegador. No se envían a un servidor. Usa “Exportar lista” para descargar una copia de tus favoritos.</p></section>`, 'Acerca de easytravel');
  }
  document.addEventListener('click', async e => {
    const button = e.target.closest('[data-action]'); if (!button) return;
    const action = button.dataset.action;
    if (action === 'favorite') {
      const id = button.dataset.code; let next = favorites();
      if (next.some(c => code(c) === id)) { next = next.filter(c => code(c) !== id); toast('Destino eliminado de favoritos.'); }
      else { const c = countries.find(c => code(c) === id) || {cca3:id,name:{common:button.closest('.app-card')?.querySelector('h2')?.textContent || id},flags:{svg:button.closest('.app-card')?.querySelector('img')?.src || ''}}; next.push(c); toast('Destino guardado en favoritos.'); }
      set(KEYS.favorites,next); setCount(); if (page === 'favoritos.html') renderFavorites(); else if (page === 'destino.html') renderDetail(); else if (page === 'explorar.html') renderCountries(); else if (page === 'index.html') renderHome();
    }
    if (action === 'reload') loadCountries();
    if (action === 'export-favorites') { const blob = new Blob([JSON.stringify(favorites(),null,2)],{type:'application/json'}), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'easytravel-favoritos.json'; a.click(); URL.revokeObjectURL(a.href); }
    if (action === 'delete-trip') { const arr = trips(); arr.splice(Number(button.dataset.index),1); set(KEYS.trips,arr); renderTrips(); }
    if (action === 'delete-activity') { const arr=trips(), t=arr[Number(button.dataset.trip)]; t.activities.splice(Number(button.dataset.index),1); set(KEYS.trips,arr); renderTrips(); }
  });
  document.addEventListener('input', e => { if (e.target.matches('#country-search')) renderCountries(); });
  document.addEventListener('change', e => { if (e.target.matches('#region-filter')) renderCountries(); });
  document.addEventListener('submit', e => { const form=e.target.closest('.app-activity-form'); if(!form)return; e.preventDefault(); const arr=trips(), item=arr[Number(form.dataset.trip)], value=new FormData(form).get('activity').trim(); if(value){item.activities.push(value);set(KEYS.trips,arr);renderTrips();} });
  document.addEventListener('submit', e => { if(e.target.id==='home-search'){e.preventDefault();location.href=`explorar.html?actualizacion=3&q=${encodeURIComponent(e.target.q.value)}`;} });
  setCount();
  if (page === 'explorar.html') renderExplore();
  else if (page === 'favoritos.html' || page === 'favoritos-vacio.html') renderFavorites();
  else if (page === 'destino.html') renderDetail();
  else if (page === 'itinerario.html') renderTrips();
  else if (page === 'acerca.html') renderAbout();
  else if (page === 'index.html' || page === '') renderHome();
})();
