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
 - 'npx prisma init'
add .env at .gitignore
complete line DATABASE_URL="" at .env
schema.prisma setting provider
install "Prisma" vscode extension to help formating and autocompleting

 - 'npx prisma migrate dev' to create Client for DB
track db file name set as "add_user"
add *.db* at .gitignore
install "sqlite viewer" vscode extension to check *.db tables

creates db.ts file under lib folder and import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()
export default db

 - 'npx prisma studio' to check db tables

modify settings.json to autocomplete by vscode
"[prisma]": {
"editor.defaultFormatter": "Prisma.prisma"
}

whenever we modify schema(./prisma/schema.prisma), need to type
'npx prisma migrate dev'.
through this command update client.
```

```password hashing
npm i bcrypt
npm i @types/bcrypt
```

```Iron session
npm i iron-session
getIronSession(cookies())
https://1password.com/ko/password-generator/
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
[OAuth scope option](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
[OAuth documentation user](https://docs.github.com/rest/users/users#get-the-authenticated-user)
