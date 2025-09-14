# ⚖️ Sibyl – Legal Marketplace

**Sibyl** is a legal marketplace platform connecting **Clients** and **Lawyers**. Clients can create legal cases, upload documents, receive quotes from lawyers, accept a quote, and pay securely via **Stripe**.

---

## 🚀 Tech Stack

* **Next.js 13+ (App Router)**
* **Prisma + PostgreSQL (Supabase)**
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
    POST   /register                                      → Create new user x
    POST   /otp                                           → Send OTP via Email (Forgot Password) x
    PUT    /otp                                           → Verify OTP via and update Password x
  /cases
    POST   /cases                                         → Client creates case x
    GET    /cases                                         → Client lists own cases x
    GET    /cases/[:caseId]                               → Case detail (show files only to ACCEPTED lawyer) x
    PATCH  /cases/[:caseId]                               → Update case (OPEN & no quotes yet) x
    PATCH  /cases/[:caseId]/close                         → Close case (client only, ENGAGED → CLOSED) x
    DELETE /cases/[:caseId]/files/[:fileId]               → Delete file (OPEN & no quotes yet) x
    GET    /cases/[:caseId]/files/[:fileId]               → Download file (access controlled) x
    GET    /cases/[:caseId]/quotes                        → List quotes for a case (pagination/filter) x
    POST   /cases/[:caseId]/quotes/[:quoteId]/accept      → Client accepts quote → Stripe checkout x    
  /lawyer
    GET    /marketplace/cases                             → Lawyer browse open cases
    POST   /marketplace/cases/[:caseId]/quotes            → Submit quote
    PATCH  /marketplace/cases/[:caseId]/quotes/[:quoteId] → Update quote
    GET    /quotes                                        → Lawyer lists own quotes
  /admin
    GET    /users                 → Admin list users (pagination/filter)
  /notifications
    GET    /notifications                                  → List user notifications (pagination/filter)
  /webhooks
    POST   /stripe                                         → Stripe webhook (paid/failed/expired)
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
