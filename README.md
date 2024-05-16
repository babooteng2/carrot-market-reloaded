# Carrot Market Reloaded

```terminal
npm i -D daisyui@latest
npm install @heroicons/react
npm i zod
npm i validator
npm i @types/validator

npm i prisma
```

```prisma setting
npx prisma init
add .env at .gitignore
complete line DATABASE_URL="" at .env
schema.prisma setting provider
install "Prisma" vscode extension to help formating and autocompleting

npx prisma migrate dev
track db file name set as "add_user"
add *.db* at .gitignore
install "sqlite viewer" vscode extension to check *.db tables
```

```tailwind.config.js
module.exports = {
  //...
  plugins: [require("daisyui")],
}
```

[daisyUI](https://daisyui.com/docs/install/)
[daisyUI test](https://stackblitz.com/edit/daisyui-nextjs?file=tailwind.config.js)
[tailwindcss Customizing Colors](https://tailwindcss.com/docs/customizing-colors)
[heroicons](https://github.com/tailwindlabs/heroicons)
