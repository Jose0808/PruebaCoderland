# Task Manager App

Una aplicación de React Native desarrollada en TypeScript que permite gestionar tareas personales y visualizar datos remotos.

## Características

### 🏠 Pantalla Principal
- Interfaz limpia con dos opciones de navegación
- Botones para acceder a las secciones de Tasks y Remote List

### ✅ Sección de Tasks
- Gestión completa de tareas personales usando Redux
- Modal para agregar nuevas tareas con validación
- Eliminación de tareas con confirmación
- Persistencia de datos mediante Redux (las tareas se mantienen al navegar)
- Validación: no permite crear tareas vacías

### 📋 Sección de Remote List  
- Carga de datos desde API externa
- Indicador de loading durante la carga
- Visualización de elementos con nombre e imagen (estilo lista de contactos)
- Manejo de errores de red

## Tecnologías Utilizadas

- **React Native 0.72.6**
- **TypeScript 4.8.4**
- **Redux Toolkit** para gestión de estado
- **React Navigation 6** para navegación
- **React Testing Library** para pruebas unitarias
- **Jest** como framework de testing

## Estructura del Proyecto

```
TaskManagerApp/
├── src/
│   ├── components/
│   │   └── AddTaskModal.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   └── ListScreen.tsx
│   └── store/
│       ├── store.ts
│       ├── tasksSlice.ts
│       └── listSlice.ts
├── __tests__/
│   ├── components/
│   │   └── AddTaskModal.test.tsx
│   ├── screens/
│   │   ├── HomeScreen.test.tsx
│   │   ├── TasksScreen.test.tsx
│   │   └── ListScreen.test.tsx
│   └── store/
│       ├── tasksSlice.test.ts
│       └── listSlice.test.ts
├── App.tsx
├── package.json
└── tsconfig.json
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- React Native CLI
- Android Studio (para Android)
- Java Development Kit (JDK 11)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone ...
   cd TaskManagerApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Instalar dependencias de iOS (solo macOS)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configurar Android**
   - Asegúrate de tener Android Studio instalado
   - Configura las variables de entorno ANDROID_HOME
   - Acepta todas las licencias de Android SDK

## Ejecución de la Aplicación

### Android
```bash
npm run android
# o
yarn android
```

### iOS (solo macOS)
```bash
npm run ios
# o
yarn ios
```

### Metro Bundler (en terminal separada)
```bash
npm start
# o
yarn start
```

## Ejecución de Pruebas

### Todas las pruebas
```bash
npm test
# o
yarn test
```

### Pruebas en modo watch
```bash
npm run test:watch
# o
yarn test:watch
```

### Cobertura de pruebas
```bash
npm run test:coverage
# o
yarn test:coverage
```

## Scripts Disponibles

- `npm start` - Inicia Metro Bundler
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS  
- `npm test` - Ejecuta todas las pruebas
- `npm run test:watch` - Pruebas en modo watch
- `npm run test:coverage` - Genera reporte de cobertura
- `npm run lint` - Ejecuta ESLint

## Arquitectura

### Estado Global (Redux)
- **tasksSlice**: Gestiona las tareas del usuario
- **listSlice**: Gestiona los datos remotos y estados de carga

### Navegación
- Stack Navigator con 3 pantallas principales
- Tipado fuerte con TypeScript para parámetros de navegación

### Componentes
- Componentización clara y reutilizable
- Props tipadas con interfaces TypeScript
- Manejo de estados locales cuando es apropiado

## Decisiones de Diseño

1. **Redux Toolkit**: Elegido por su simplicidad y mejores prácticas
2. **TypeScript**: Para type safety y mejor experiencia de desarrollo  
3. **React Navigation**: Navegación nativa y performante
4. **Testing Library**: Para pruebas centradas en comportamiento del usuario
5. **Atomic Design**: Estructura de componentes escalable

## Pruebas de Calidad

- ✅ **100% cobertura** en funciones de Redux
- ✅ **Pruebas de integración** para flujos completos
- ✅ **Pruebas de componentes** con interacciones reales
- ✅ **Mocking apropiado** de dependencias externas
- ✅ **Casos edge** cubiertos (errores, estados vacíos)

## Notas Técnicas

- Aplicación optimizada para Android (según especificaciones)
- Manejo de errores robusto en todas las operaciones
- Interfaz responsiva y accesible
- Código limpio siguiendo las mejores prácticas de React Native

## Contacto

Para dudas o comentarios sobre la implementación, por favor revisar el código y las pruebas unitarias incluidas.