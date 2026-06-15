# DueloDeHuevos - AI Agent Instructions

## Project Overview
Trading Card Game (TCG) online construido con React 19 + Vite 7 + Tailwind CSS 3.4. Todo el frontend es funcional con datos mock. Backend pendiente de implementar.

## Tech Stack
- **React 19.1.1** con JSX (no TypeScript)
- **Vite 7.1.7** como build tool
- **Tailwind CSS 3.4.18** para estilos
- **Lucide React 0.552.0** para iconos
- **ESLint 9** con flat config (`eslint.config.js`)
- Sin React Router — navegación state-based con `useState`

## Code Structure
```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas principales (una por ruta)
├── context/         # React Context (authContext)
├── mocks/           # Datos mock para desarrollo
├── types/           # Definiciones JSDoc y validadores
├── utils/           # Helpers y utilidades
└── assets/serie1/   # Imágenes JPG de cartas
```

## Conventions

### Naming
- Archivos JSX: `PascalCase.jsx` (ej. `HomePage.jsx`, `CartaModal.jsx`)
- Archivos JS (sin JSX): `camelCase.js` (ej. `useAuth.js`, `cardImageMap.js`)
- Carpetas: `camelCase/`

### Imports
```jsx
import Componente from './components/Componente'
import { hook } from './context/useAuth'
import { helper } from './utils/helper'
```

### Routing
No hay React Router. Se usa estado en `App.jsx`:
```jsx
const [currentPage, setCurrentPage] = useState('home')
```
Para agregar una nueva página:
1. Crear archivo en `src/pages/`
2. Importarlo en `App.jsx`
3. Agregar un `case` en el switch de renderizado

### Data Flow
- Los datos de cartas vienen de `public/data/cardsS1.json` (fetch)
- El estado de usuario se maneja con Context API (`AuthContext.jsx`)
- Datos mock en `src/mocks/`
- No hay llamadas a API reales

### Card System
- 106 cartas en Serie 1 (`cardsS1.json`)
- Categorías: `huevo_de_combate`, `hechizo`, `trampa`, `encantamiento_fuerte`, `encantamiento_debil`
- Clases: `Clara`, `Yema`, `Cascaron`, `Podrido`, `Hechizo`, `Trampa`, `Encantamiento`
- Imágenes: 70 de 106 cartas tienen JPG en `src/assets/serie1/` mapeadas via `utils/cardImageMap.js`
- Serial format: `DHO-S1{NNN}`

### Styling
- Tailwind CSS utility classes siempre
- No usar CSS modules ni styled-components
- No escribir CSS manual en archivos `.css` (excepto `index.css` para directivas `@tailwind`)

### Linting
```bash
npm run lint    # ESLint con flat config
```

### Building
```bash
npm run dev     # Dev server
npm run build   # Producción
```

## Common Tasks

### Agregar nueva página
1. Crear `src/pages/NuevaPage.jsx`
2. Importar en `App.jsx` y agregar al switch de `currentPage`
3. Agregar enlace en `Navigation.jsx` si aplica

### Agregar nueva carta
1. Agregar objeto al array en `public/data/cardsS1.json`
2. Agregar imagen JPG en `src/assets/serie1/` con nombre `DHO-S1{NNN}.jpg`
3. Verificar que el `serial` sea único

### Agregar filtro en Colección/DeckBuilder
- `CollectionPage.jsx` y `DeckBuilderPage.jsx` manejan filtros localmente con `useState`
- La función de filtrado itera sobre `cards` y retorna `filteredCards`
- Para nuevo filtro, agregar estado + UI + lógica de filtrado en el mismo archivo

### Modificar el tablero de juego
- `GameBoard.jsx` en `src/components/`
- Se renderiza standalone via `gameboard.html` + `src/gameboard.jsx`
- No tiene lógica de juego real — solo muestra zonas clickeables
