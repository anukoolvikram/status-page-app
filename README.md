# Status Page Application

A modern, real-time status page application for monitoring services and incidents.

## Features

- ✅ Multi-tenant organization support
- ✅ Service management (CRUD)
- ✅ Incident tracking with updates
- ✅ Real-time status updates
- ✅ Public status pages
- ✅ Clean UI with shadcn/ui
- ✅ Authentication with Clerk

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **UI**: shadcn/ui + Tailwind CSS
- **Real-time**: Pusher Channels
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Pusher account (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/status-page.git
cd status-page
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`

4. Setup database
```bash
npx prisma db push
npx prisma generate
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Pusher (optional)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

## Usage

### Creating a Service

1. Navigate to Dashboard > Services
2. Click "Add Service"
3. Fill in service details
4. Select initial status

### Creating an Incident

1. Navigate to Dashboard > Incidents
2. Click "Create Incident"
3. Select affected service
4. Set status and impact level
5. Add description

### Viewing Status Page

Your public status page is available at:
`/status/[your-org-slug]`

## Project Structure