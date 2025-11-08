# React Star Wars Live Search

Aplicación React que consume la [Star Wars API (SWAPI)](https://swapi.dev/) para mostrar personajes con búsqueda en tiempo real y filtros avanzados. Mientras el usuario escribe, la interfaz consulta la API vía Ajax y ordena automáticamente los resultados de forma alfabética.

## ✨ Características
- Búsqueda instantánea con `debounce` sobre el endpoint `/people/` de SWAPI.
- Botón “Cargar todos” que trae todas las páginas disponibles de personajes.
- Filtros por género, rango de peso (kg) y estatura (cm).
- Interfaz responsiva usando React-Bootstrap con tarjetas y badges.
- Manejo de estados de carga, errores y vacíos de datos.

## 🛠 Requisitos previos
- Node.js >= 18
- npm >= 9

## 🚀 Puesta en marcha
```bash
git clone https://github.com/perez-gerardo/react-starwars-live-search.git
cd react-starwars-live-search
npm install
npm start
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador para ver la aplicación en modo desarrollo. Los cambios se recargan automáticamente.

## 📦 Scripts disponibles
- `npm start` – modo desarrollo con recarga en vivo.
- `npm run build` – genera el build optimizado para producción en `build/`.
- `npm test` – ejecuta los tests en modo interactivo (CRA por defecto).

## 🧠 Arquitectura básica
```
src/
├── components/
│   └── CharacterLoader.js  # Lógica de peticiones y renderizado de personajes
├── App.js                  # Monta el componente principal
├── App.css                 # Estilos personalizados con tema visual moderno
└── index.js                # Punto de entrada, incluye Bootstrap
```

## 🔌 API utilizada
Los personajes se obtienen desde `https://swapi.dev/api/people/`. El componente maneja la paginación y normaliza URLs HTTP → HTTPS para evitar bloqueos de contenido mixto.

## 📸 Vista previa
> Lista de personajes estilizada con tarjetas, búsqueda superior, filtros y contador de resultados.

*(Agrega aquí una captura de pantalla cuando la tengas disponible).*

## 🤝 Contribuciones
Los issues y pull requests son bienvenidos. Cualquier mejora visual o nuevo filtro es una excelente forma de extender la práctica.

## 📄 Licencia
Proyecto educativo sin licencia específica. Úsalo libremente como referencia para tus laboratorios o tareas.
