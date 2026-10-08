# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## Implementación de las instrucciones (octubre de 2026)

Se conserva NestJS/Prisma/PostgreSQL y la autenticación existente. El formulario público de contacto ahora indica que es una simulación y muestra un resultado local. El carrito público conserva la creación real de pedidos mediante la API y evita confirmaciones duplicadas; el resultado se registra únicamente después de una respuesta correcta. Las rutas administrativas están traducidas, pero no se instrumentan en la analítica pública. Se reemplazaron tipos any por contratos de pedidos/menú y errores unknown, sin cambiar los contratos del servidor.

La interfaz admite Español / English desde un selector accesible. Se recuerda la elección cuando el navegador permite almacenamiento; sin elección usa un idioma soportado del navegador y español como alternativa. Se actualizan lang, título y descripción. El cambio conserva rutas, filtros, carrito y campos. Los catálogos están en src/site/catalog.json; las claves son estables y las traducciones de contenido existente no modifican identificadores, precios ni bases de negocio. Contenido procedente de la API fuera del catálogo se conserva: nuevos productos o mensajes requieren sus traducciones correspondientes.

### Instalación y verificación

Desde alitas-bonnibel-frontend/:

```powershell
npm ci
npm run dev
npm run lint
npm run build
npm run test:i18n
npm run test:analytics
```

En entornos Windows donde el empaquetador de la configuración de Vite da Access is denied, se verificó npm run build -- --configLoader runner; esto no modifica el stack ni sus dependencias.

### Analítica y límites

Consulta [contrato, variables, ejecución, persistencia y copias de seguridad](../analytics/README.md). El servicio SQLite y sus pruebas están en analytics/ en la raíz del repositorio. Analítica desactivada hasta configurar su URL. La persistencia de producción, HTTPS y el alojamiento están pendientes de confirmar; no se publicaron cambios ni se contrataron servicios.
