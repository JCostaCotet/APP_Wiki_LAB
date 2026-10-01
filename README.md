# APP_Wiki_LAB

Aplicació d'escriptori per consultar i organitzar documentació tècnica de LAB Circuits.

L'objectiu és disposar d'una eina tipus wiki que permeti accedir de manera ràpida a documentació interna, organitzada per categories, i facilitar-ne la cerca tant pel nom del document com pel seu contingut.

## Objectius

- Organitzar documents per temes i categories.
- Mostrar una llista de documents disponibles.
- Cercar documents pel nom.
- Cercar informació dins del contingut dels documents.
- Visualitzar documents des de la mateixa aplicació.
- Treballar principalment amb documents PDF i DOC/DOCX.
- Disposar d'una aplicació d'escriptori per Windows.

## Stack tecnològic

- Electron
- React
- TypeScript
- Vite
- Electron Forge
- HTML
- CSS

## Estat actual

El projecte es troba en fase inicial de desenvolupament.

Actualment ja estan implementats:

- Entorn Electron + Vite + TypeScript.
- React integrat al renderer.
- Layout principal de l'aplicació.
- Header.
- Sidebar.
- DocumentList.
- Repositori Git.
- Repositori remot a GitHub.

## Estructura inicial

```text
src/
├── components/
│   ├── Header/
│   ├── Sidebar/
│   └── DocumentList/
│
├── App.tsx
├── main.ts
├── preload.ts
├── renderer.ts
└── index.css
