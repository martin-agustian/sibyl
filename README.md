# ⚖️ Sibyl – Legal Marketplace

**Sibyl** is a legal marketplace platform connecting **Clients** and **Lawyers**. Clients can create legal cases, upload documents, receive quotes from lawyers, accept a quote, and pay securely via **Stripe**.

---

## 🚀 Tech Stack

* **Next.js 13+ (App Router)**
* **Prisma + PostgreSQL (Supabase)**
* **MUI** (styled components base)
* **NextAuth.js** (JWT strategy, role-based access)
* **Stripe** (checkout & webhook payments)
* **Cloudinary** (document storage)
* **Nodemailer** (email notifications)
* **TypeScript**

---

## 📂 API Structure

```
/api
  /auth/[...nextauth]                                     → Authentication (login/logout)
  /auth
    POST   /register                                      → Create new user
    POST   /otp                                           → Send OTP via Email (Forgot Password)
    PUT    /otp                                           → Verify OTP via and update Password
  /cases
    POST   /cases                                         → Client creates case
    GET    /cases                                         → Client lists own cases
    GET    /cases/[:caseId]                               → Case detail (show files only to ACCEPTED lawyer) x
    PATCH  /cases/[:caseId]                               → Update case (OPEN & no quotes yet)
    PATCH  /cases/[:caseId]/close                         → Close case (client only, ENGAGED → CLOSED)
    DELETE /cases/[:caseId]/files/[:fileId]               → Delete file (OPEN & no quotes yet)
    GET    /cases/[:caseId]/files/[:fileId]               → Download file (access controlled)
    GET    /cases/[:caseId]/quotes                        → List quotes for a case (pagination/filter)
    POST   /cases/[:caseId]/quotes/[:quoteId]/accept      → Client accepts quote → Stripe checkout  
  /lawyer
    GET    /marketplace/cases                             → Lawyer browse open cases
    POST   /marketplace/cases/[:caseId]/quotes            → Submit quote
    PATCH  /marketplace/cases/[:caseId]/quotes/[:quoteId] → Update quote
    GET    /quotes                                        → Lawyer lists own quotes
  /admin
    GET    /users                                         → Admin list users (pagination/filter)
  /notifications
    GET    /notifications                                 → List user notifications (pagination/filter)
  /webhooks
    POST   /stripe                                        → Stripe webhook (paid/failed/expired)
```

---

## 📂 FOLDER Structure

```
/prisma
│
├── schema.prisma       → Defines database models and connection setup
├── seed.ts             → Script for generating dummy data into the database
└── migrate/            → Contains Prisma migration history and files

/public
└── images/             → Publicly accessible images (e.g., logos, assets)

/src
│
├── app/
│   ├── (Dashboard)/    → UI pages for dashboards (admin, lawyer, client)
│   ├── (Landing)/      → UI pages for the landing/home page
│   ├── (Auth)/         → UI pages for authentication (login, register, forgot password)
│   └── api/            → API route handlers (path reflects the folder structure)
│
├── commons/
│   ├── helper/         → Reusable utility functions (e.g., formatters, parsers)
│   ├── type/           → Commonly used type definitions (e.g., status enums, user roles)
│   └── constants.ts    → Static values like roles, case statuses, etc.
│
├── components/         → Global and reusable UI components (e.g., form inputs, logo, table rows)
│
├── hooks/              → Custom React hooks (e.g., useDownloadFile, useDebounce)
│                        → Similar to `/commons/helper`, but focused on stateful or side-effect logic
│
├── lib/                → Configured libraries and integrations (e.g., auth, prisma, stripe)
│
├── schema/             → Form validation schemas (e.g., Zod schemas for inputs, file size limits)
│
├── types/              → Global type definitions (e.g., `User`, `Quote`, API request bodies)
│
├── utils/              → Utility files for theming, styling, or non-component utilities
│
└── middleware.ts       → Middleware logic (e.g., route protection, auth guards)
```

---

## 🔑 Roles & Access Control

* **Client**

  * Create and manage cases (can only update if case is `OPEN` and has no quotes yet).
  * View all quotes for their cases.
  * Accept quotes & pay via Stripe.
  * Close case once it is finished.

* **Lawyer**

  * Browse open cases.
  * Submit/update quotes.
  * Access case files **only if their quote is accepted and payment is successful**.
  * View list of their own quotes.

* **Admin**

  * List users.
  * View all case with quotes (only views).

* **Notifications**

  * All major events (new quote, quote accepted, payment success/failed) → generate **in-app notification** (DB) + **email notification**.

---

## 📦 Database Models (Prisma)

* **User** → Clients, Lawyers, Admins (role-based).
* **Case** → Created by client, has many files & quotes.
* **File** → Case documents (stored in Cloudinary).
* **Quote** → Lawyer proposal for a case.
* **Payment** → Stripe transaction (status: pending / paid / failed).
* **Notification** → In-app notification for user.

---

## ⚡ Development Setup

1. Clone repo & install dependencies

   ```bash
   npm install
   ```
2. Setup environment variables in `.env`

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET=""
   .... See .env.example (i leave comments there)
   ```
3. Run Prisma migration

   ```bash
   npx prisma migrate dev
   ```
4. Start dev server

   ```bash
   npm run dev
   ```
