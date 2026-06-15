# 🥚 Duelo de Huevos - TCG Online

Un Trading Card Game (TCG) Online construido con React + Vite + Tailwind CSS.

## 📁 Estructura del Proyecto

```
DueloDeHuevos/
├── src/
│   ├── assets/
│   │   └── serie1/                 # 70 imágenes JPG de cartas
│   ├── components/
│   │   ├── CartaComponent.jsx      # Miniatura de carta para colección
│   │   ├── CartaModal.jsx          # Modal con detalle completo de carta
│   │   ├── DeckCardTile.jsx        # Tile arrastrable para constructor de mazos
│   │   ├── GameBoard.jsx           # Tablero de juego interactivo
│   │   └── Navigation.jsx          # Barra de navegación responsive
│   ├── context/
│   │   ├── authContext.js          # Creación del contexto
│   │   ├── AuthContext.jsx         # Provider con login/register/logout (mock)
│   │   └── useAuth.js              # Hook personalizado para consumir contexto
│   ├── mocks/
│   │   ├── auth.js                 # Datos mock de usuario
│   │   ├── decks.js                # Mazos precargados (sin uso actual)
│   │   ├── gameboard.js            # Carta mock para el tablero
│   │   ├── home.js                 # Contador mock de jugadores online
│   │   └── ranking.js              # 10 jugadores mock para ranking
│   ├── pages/
│   │   ├── HomePage.jsx            # Dashboard con estadísticas del jugador
│   │   ├── LoginPage.jsx           # Formulario de inicio de sesión/registro
│   │   ├── PlayPage.jsx            # Selección de modos de juego (4 modos)
│   │   ├── DeckBuilderPage.jsx     # Constructor de mazos con drag & drop
│   │   ├── CollectionPage.jsx      # Galería de cartas con búsqueda/filtros
│   │   ├── RankingPage.jsx         # Tabla de clasificación global (mock)
│   │   └── ProfilePage.jsx         # Perfil de usuario con estadísticas
│   ├── types/
│   │   └── card.js                 # Definiciones JSDoc y validador parseCardsPayload()
│   ├── utils/
│   │   ├── cardCategory.js         # Etiquetas, ordenamiento y helpers de categorías
│   │   └── cardImageMap.js         # Mapeo de seriales a imágenes vía Vite glob
│   ├── App.jsx                     # Componente principal con enrutamiento
│   ├── gameboard.jsx               # Punto de entrada independiente para gameboard.html
│   ├── main.jsx                    # Punto de entrada de la aplicación
│   ├── App.css                     # Estilos del componente App
│   └── index.css                   # Estilos globales (Tailwind)
├── public/
│   ├── vite.svg                    # Icono de Vite
│   └── data/
│       └── cardsS1.json            # Base de datos de cartas - Serie 1 (106 cartas)
├── gameboard.html                  # HTML para el tablero de juego standalone
├── index.html                      # HTML principal
├── package.json                    # Dependencias y scripts
├── tailwind.config.js              # Configuración de Tailwind CSS
├── postcss.config.js               # Configuración de PostCSS
├── vite.config.js                  # Configuración de Vite
├── eslint.config.js                # Configuración de ESLint
└── dist/                           # Build de producción
```

## ✨ Características Implementadas

### 🔐 Sistema de Autenticación (Mock)
- Login/Registro con almacenamiento en `localStorage`
- Context API para manejo del estado de usuario
- Persistencia de sesión al recargar la página
- Validación simulada (cualquier usuario/contraseña es aceptada)

### 📄 Páginas Principales

| Página | Descripción |
|--------|-------------|
| **Home** | Dashboard con estadísticas del jugador (victorias, derrotas, puntos de ranking, racha) |
| **Jugar** | 4 modos de juego: Duelo rápido, Clasificatoria, Sala privada, vs IA |
| **Constructor de Mazos** | Gestión y creación de mazos personalizados con drag & drop |
| **Colección** | Visualización de 106 cartas con búsqueda, filtros por categoría, clase, tipo, nivel, ATK y DEF |
| **Ranking** | Tabla de clasificación global con 10 jugadores simulados |
| **Perfil** | Información detallada del usuario con estadísticas |

### 🃏 Sistema de Cartas

#### Estructura de Carta
```json
{
  "id": 1,
  "serial": "DHO-S1001",
  "categoria": "Trampa",
  "nombre": "Ablandador de huevos",
  "nivel": null,
  "clase": "Trampa",
  "tipo": "N/A",
  "ataque": null,
  "defensa": null,
  "efecto": "Descripción del efecto...",
  "ambientacion": "Texto de ambientación..."
}
```

#### Categorías
- **Huevo de combate**: Cartas principales con ATK, DEF y nivel (60 cartas)
- **Hechizo**: Cartas de efectos mágicos (26 cartas)
- **Trampa**: Cartas de respuesta defensiva (15 cartas)
- **Encantamiento fuerte**: Modificadores poderosos (3 cartas)
- **Encantamiento débil**: Modificadores menores (2 cartas)

#### Clases de Cartas
| Clase | Icono | Descripción |
|-------|-------|-------------|
| Clara | 💧 | Huevos de clara (4) |
| Yema | 🌟 | Huevos de yema (22) |
| Cascarón | 🛡️ | Huevos con cascarón resistente (12) |
| Podrido | 💀 | Huevos podridos (22) |
| Hechizo | ✨ | Cartas de hechizo (26) |
| Trampa | 🪤 | Cartas de trampa (15) |
| Encantamiento | ⚡ | Encantamientos (5) |

### 🎮 Tablero de Juego

El tablero (`GameBoard.jsx`) implementa un grid 2x8 por jugador con las siguientes zonas:

| Zona | Posición | Descripción |
|------|----------|-------------|
| Encantamiento Fuerte | (0,0) | Encantamiento poderoso |
| Huevos de Combate | (0,1-6) | 6 posiciones para huevos |
| Basura | (0,7) | Cementerio de cartas |
| Encantamiento Débil | (1,0) | Encantamiento menor |
| Trampas | (1,1-3) | 3 posiciones para trampas |
| Hechizos | (1,4-6) | 3 posiciones para hechizos |
| Biblioteca | (1,7) | Mazo de robo |

Actualmente el tablero muestra una carta mock al hacer clic en las zonas. No hay lógica de juego implementada.

### 🖼️ Imágenes de Cartas
- **70 de 106 cartas** tienen imagen JPG asociada en `src/assets/serie1/`
- Las imágenes se mapean automáticamente desde el serial de la carta mediante Vite glob imports
- Las 36 cartas restantes muestran un placeholder

### 🧩 Constructor de Mazos
- Búsqueda de cartas por nombre
- Filtros por categoría (Todas / Huevo de combate / Hechizo / Trampa / Encantamiento)
- Filtros avanzados para huevos de combate: clase, tipo, nivel, ATK mínimo, DEF mínimo
- Arrastrar y soltar (drag & drop) entre resultados de búsqueda y el mazo
- Límite de **3 copias** por carta por mazo
- **30 cartas** máximo en mazo principal
- **10 cartas** máximo en librería de reserva
- Vista previa de carta seleccionada con efecto y ambientación
- Creación de múltiples mazos

### 📱 Diseño Responsive
- Navegación adaptable con menú hamburguesa en dispositivos móviles
- Grid de cartas responsive
- Tablero de juego con scroll horizontal en pantallas pequeñas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca de UI
- **Vite 7.1.7** - Build tool y servidor de desarrollo
- **Tailwind CSS 3.4.18** - Framework de estilos
- **Lucide React 0.552.0** - Iconos

### Dependencias Backend (Instaladas, sin implementar)
- **Express 5.1.0** - Servidor Node.js
- **PostgreSQL (pg 8.16.3)** - Base de datos
- **JWT (jsonwebtoken 9.0.2)** - Autenticación
- **bcryptjs 3.0.2** - Encriptación de contraseñas
- **cors 2.8.5** - Middleware de CORS
- **dotenv 17.2.3** - Variables de entorno

## 🚀 Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 📊 Estado del Proyecto

- ✅ Frontend funcional con datos mock
- ✅ Sistema de cartas completo: 106 cartas en JSON (Serie 1)
- ✅ 70 imágenes de cartas en galería
- ✅ Navegación entre páginas (state-based, sin React Router)
- ✅ Constructor de mazos con drag & drop y filtros avanzados
- ✅ Tablero de juego básico (standalone, sin lógica de juego)
- ⏳ Imágenes restantes para 36 cartas
- ⏳ Backend pendiente de implementación (dependencias instaladas)
- ⏳ Conexión con base de datos PostgreSQL
- ⏳ Autenticación real con JWT
- ⏳ Sistema de juego en tiempo real (WebSockets)
- ⏳ React Router para navegación con URLs

## 🎯 Próximos Pasos

1. Implementar servidor Express con API REST
2. Configurar base de datos PostgreSQL
3. Implementar autenticación real con JWT
4. Agregar imágenes faltantes de cartas
5. Crear sistema de matchmaking
6. Implementar lógica de juego en tiempo real (WebSockets)
7. Migrar a React Router para navegación con URLs
8. Agregar más series de cartas

## 📝 Licencia

ISC

---

Desarrollado con ❤️ para los amantes de los TCG
