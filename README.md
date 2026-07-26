# Duelo de Huevos - Galería pública

Esta rama `page/gallery` publica una versión reducida del proyecto enfocada solo en la colección de cartas.

## Qué incluye
- Galería pública de cartas de Serie 1.
- Búsqueda por nombre.
- Filtro por categoría.
- Botones de series con estado `Próximamente` para las siguientes entregas.
- Modal de detalle para cada carta.

## Qué se eliminó de esta rama
- Login y autenticación.
- Home, perfil, ranking, constructor de mazos y pantalla de juego.
- Navegación interna de la app completa.

## Estructura relevante
- `src/App.jsx` monta solo la galería.
- `src/pages/CollectionPage.jsx` contiene toda la experiencia pública.
- `public/data/cardsS1.json` es la fuente de datos de cartas.
- `public/assets/icons/ddh_logo.png` es el favicon usado por el sitio.

## Desarrollo
```bash
npm install
npm run dev
npm run lint
npm run build
```

## Deploy en GitHub Pages
- Esta rama está preparada para publicarse como sitio estático.
- `vite.config.js` usa `base: './'` para que los assets funcionen en Pages.
- Antes de publicar, configura GitHub Pages para servir desde esta rama o desde el workflow que uses en el repositorio.

## Notas
- Las cartas de Series 2 a 5 aparecen como `Próximamente`.
- La galería carga las cartas desde el JSON público y no requiere sesión.
