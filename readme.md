# FullStack User Authentication

## Introduction

FullStack User Authentication with MERN

### Project Structure

#### Front-End

```sh
  /public
  /src
    /assets
    main.tsx
    index.css
    App.tsx
    ...
  .eslintrc.cjs
  index.html
  package.json
  ...
```

#### Back-End: Node.js

```sh
  /public
  /src
    /controllers
    /routes
    /types
    /utils
    index.ts
    app.ts
    ...
  .eslintrc
  .prettierrc.json
  nodemon.json
  package.json
  tsconfig.json
  ...
```

### Running Locally

1. Clone the repository:

```sh
git clone https://github.com/diwashbhattarai999/FullStack-UserAuth.git

```

#### Front-End: React.js

1. Navigate to the `client` directory.

```sh
cd client
```

2. Run `pnpm install` to install dependencies.

```sh
pnpm install
```

3. Run `pnpm start` to start the development server.

4. Open [http://localhost:5173](http://localhost:5173) in your browser

#### Back-End: Express.js

1. Navigate to the `server` directory.

```sh
cd server
```

2. Run `pnpm install` to install dependencies.

```sh
pnpm install
```

3. Start the server:

```sh
# if running dev server
npm run dev

# if running prod server
npm run build
npm run start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
