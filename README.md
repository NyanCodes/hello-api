
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Authentication setup

The API implements the eight authentication handouts using this project's `app/` and `lib/` directories.

1. Run `npm install` in `hello-api` to install bcrypt, cookie, and jsonwebtoken and update the lockfile. Cookie creation uses Next.js's built-in response cookie API.
2. Edit `.env.local`: set `ADMIN_USER` and `ADMIN_PASS`. `JWT_SECRET` must be at least 32 random characters (a random value was generated locally if absent). Keep credentials out of source control. `.env.local.example` documents the variables.
3. Keep your existing `MONGODB_URI`; `DB_NAME` defaults to `week10`. Regular accounts are read from the `user` collection with `email`, `username`, and a bcrypt-hashed `password`. The environment admin does not require a database connection. Registration is outside the supplied handouts.
4. Set `FRONTEND_ORIGIN` to the exact frontend origin, default `http://localhost:5173`. Run `npm run dev` here and in `hello-react`. Let Next.js set `NODE_ENV`; production cookies require HTTPS.
5. With the API running and admin credentials configured, run `npm run test:auth`. Optionally set `AUTH_TEST_API_URL` for another API port. This checks the real API without creating or deleting database records.

Endpoints: `POST /api/auth/login` accepts `{ "email": "admin username or user email", "password": "..." }`; `GET /api/me` and login both return `{ user: { id, email, username } }`. `POST /api/auth/logout` clears the cookie; GET remains available for handout compatibility. Sessions last seven days. Items and the database testing endpoint require a verified session; `/api/hello` remains a public connectivity check. CORS preflight supports DELETE as well as GET/POST/PUT.

Corrections to the handouts: consistent user response shape, 200 for profile reads, safe error handling, no credential logging, matching logout cookie attributes, JWT-based admin checks instead of trusting a client header, and initialization/error handling that works in React StrictMode. The React login form uses the existing CSS stack rather than adding Material UI and Tailwind solely for the sample markup.
