# Startup Lab

Startup Lab is a public product laboratory built with Next.js, TypeScript, and MySQL.

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

Run the app with MySQL using Docker Compose:

```bash
cp .env.example .env.local
docker compose up --build
```

App:

```bash
http://localhost:3002
```

Database:

```bash
localhost:3307
```

## Environment Variables

Start from `.env.example`. Docker Compose reads the same environment variables and defaults the host app port to `3002`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [TypeORM](https://typeorm.io/)

## Notes

- The app runs on container port `3000` and is exposed on host port `3002` by default
- MySQL runs in a sibling container and persists data in the `mysql_data` volume
