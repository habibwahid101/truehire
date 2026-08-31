# TrueHire Short MVP v0.1

Managed recruitment intake and lightweight ATS.

TrueHire presents complete job information, collects structured applications, and lets administrators review, evaluate, shortlist, interview, and decide — with a recorded activity history.

## Stack

- Next.js 15 App Router + TypeScript
- PostgreSQL + Prisma
- Signed httpOnly admin sessions (jose + bcrypt)
- Private local or S3-compatible CV storage
- Resend transactional email (console fallback in development)
- Zod validation + Tailwind CSS v4

## Local setup

```bash
cp .env.example .env
# set DATABASE_URL, AUTH_SECRET, and bootstrap admin credentials
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Never commit `.env` or uploaded CVs.
