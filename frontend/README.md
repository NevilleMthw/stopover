# Stopover Frontend

Using Nextjs, currently under development and deployment changes are being made.

## Setup and Installation

```git clone <repo-url>```
```cd stopover```

## Install Dependencies

```pnpm install```
or
```npm install```

Additionally approve build scripts for sharp: ```pnpm approve-builds```
## Run Development Server

```npm run dev```
or
```pnpm run dev```

Open http://localhost:3000 in your browser.

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts
├── public/
└── styles/
```