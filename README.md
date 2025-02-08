# Multimedia-Search-and-Retrieval
Creating a music retrieval system leveraging
multimedia data

## Running the Python notebook

To use the project you need to download the [dataset](https://cloud.cp.jku.at/index.php/s/RbAxYet7cQZ5LYz) and unpack it into the project folder.

## Running the Web App

1. Install NodeJS https://nodejs.org/uk
2. Run `npm i`
3. Run `npm run dev`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Team Spontaneous Piroshki
[Our web-based UI](https://spontaneous-piroshki-fddef9.netlify.app/)

[Our Overleaf report](https://www.overleaf.com/project/6758c2a92a0b9d1beb1daddd)

![image](https://github.com/user-attachments/assets/0efbd074-3290-45fb-9157-01e7301484c7)
