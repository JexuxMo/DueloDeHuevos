# 🥚 Duelo de Huevos - TCG Online

Un Trading Card Game (TCG) Online construido con React + Vite + Tailwind CSS.

## 📁 Estructura del Proyecto

```
DueloDeHuevos/
├── src/
│   ├── App.jsx          # Componente principal (~1000 líneas)
│   ├── gameboard.jsx    # Tablero de juego independiente
│   ├── main.jsx         # Punto de entrada
│   ├── App.css          # Estilos del componente App
│   └── index.css        # Estilos globales
├── public/
│   ├── vite.svg         # Icono de Vite
│   └── data/
│       └── cardsS1.json # Base de datos de cartas (Serie 1)
├── gameboard.html       # HTML para el tablero de juego
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts
├── tailwind.config.js   # Configuración de Tailwind CSS
├── postcss.config.js    # Configuración de PostCSS
└── vite.config.js       # Configuración de Vite
```

## ✨ Características Implementadas

### 🔐 Sistema de Autenticación (Mock)
- Login/Registro con localStorage
- Context API para manejo del estado de usuario
- Persistencia de sesión

### 📄 Páginas Principales

| Página | Descripción |
|--------|-------------|
| **Home** | Dashboard con estadísticas del jugador (victorias, derrotas, puntos de ranking) |
| **Jugar** | Modos de juego: Duelo rápido, Clasificatoria, Sala privada, vs IA |
| **Constructor de Mazos** | Gestión y creación de mazos personalizados |
| **Colección** | Visualización de cartas con búsqueda y filtros por categoría |
| **Ranking** | Tabla de clasificación global de jugadores |
| **Perfil** | Información detallada del usuario |

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
- **Huevo de combate**: Cartas principales con ATK, DEF y nivel
- **Hechizo**: Cartas de efectos mágicos
- **Trampa**: Cartas de respuesta defensiva
- **Encantamiento**: Modificadores de campo

#### Clases de Cartas
| Clase | Icono | Descripción |
|-------|-------|-------------|
| Clara | 💧 | Huevos de clara |
| Yema | 🌟 | Huevos de yema |
| Cascarón | 🛡️ | Huevos con cascarón resistente |
| Podrido | 💀 | Huevos podridos |
| Hechizo | ✨ | Cartas de hechizo |
| Trampa | 🪤 | Cartas de trampa |
| Encantamiento | ⚡ | Encantamientos |

### 🎮 Tablero de Juego

El tablero (`gameboard.jsx`) implementa un grid 2x8 por jugador con las siguientes zonas:

| Zona | Posición | Descripción |
|------|----------|-------------|
| Encantamiento Fuerte | (0,0) | Encantamiento poderoso |
| Huevos de Combate | (0,1-6) | 6 posiciones para huevos |
| Basura | (0,7) | Cementerio de cartas |
| Encantamiento Débil | (1,0) | Encantamiento menor |
| Trampas | (1,1-3) | 3 posiciones para trampas |
| Hechizos | (1,4-6) | 3 posiciones para hechizos |
| Biblioteca | (1,7) | Mazo de robo |

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca de UI
- **Vite 7.1.7** - Build tool y dev server
- **Tailwind CSS 3.4.18** - Framework de estilos
- **Lucide React 0.552.0** - Iconos

### Backend (Preparado para implementación)
- **Express 5.1.0** - Servidor Node.js
- **PostgreSQL (pg 8.16.3)** - Base de datos
- **JWT (jsonwebtoken 9.0.2)** - Autenticación
- **bcryptjs 3.0.2** - Encriptación de contraseñas

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
- ✅ Sistema de cartas completo con JSON de datos
- ✅ Navegación entre páginas implementada
- ✅ Tablero de juego básico
- ⏳ Backend pendiente de implementación
- ⏳ Conexión con base de datos PostgreSQL
- ⏳ Sistema de juego en tiempo real

## 🎯 Próximos Pasos

1. Implementar servidor Express con API REST
2. Configurar base de datos PostgreSQL
3. Implementar autenticación real con JWT
4. Crear sistema de matchmaking
5. Implementar lógica de juego en tiempo real (WebSockets)
6. Agregar más series de cartas

## 📝 Licencia

ISC

---

Desarrollado con ❤️ para los amantes de los TCG
