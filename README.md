# Carrot Market Reloaded

## Run dev

```cmd
npm run dev
npx prisma studio
```

## Depedencies

```cmd
npm i -D daisyui@latest
npm install @heroicons/react
npm i zod
npm i validator
npm i @types/validator

npm i prisma
npm i twilio
npm i react-hook-form
npm i @hookform/resolvers
```

- @hookform/resolvers : zod 스키마를 사용해서 프론트엔드와 백엔드 유효성검사 공유

## Prisma

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

## CloudFlare images

```note
Cloudflarea 계정 만들기 - 로그인 - Images - Overview - 결제 - Use API - Get an API create API token here - Create Token - Read and write to Cloudflarae Stream and Images (Use template 버튼) - Analytics 는 삭제 - Continue to summary - Create Token - copy - .env 파일
```

- next.config.mjs에 { hostname: "imagedelivery.net" } 패턴 추가

## Docs

- Intercepting Routes ([Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes))
- Parallel Routes ([Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes))

## References

[daisyUI](https://daisyui.com/docs/install/)
[daisyUI test](https://stackblitz.com/edit/daisyui-nextjs?file=tailwind.config.js)
[tailwindcss Customizing Colors](https://tailwindcss.com/docs/customizing-colors)
[heroicons](https://github.com/tailwindlabs/heroicons)
[OAuth scope option](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
[OAuth documentation user](https://docs.github.com/rest/users/users#get-the-authenticated-user)
[cloudflare images documentation](https://developers.cloudflare.com/images/upload-images/direct-creator-upload/#request-a-one-time-upload-url)
[modal](https://github.com/vercel/nextgram)
