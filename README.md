# Dayflow HRMS

Human Resource Management System - Every workday, perfectly aligned.

## Features

- **Authentication**: Secure sign up/sign in using Clerk
- **Role-based Access**: Admin and Employee roles
- **Employee Profile Management**: View and edit personal details
- **Attendance Tracking**: Daily check-in/check-out with records view
- **Leave Management**: Apply for leave, approve/reject (admin)
- **Payroll Management**: View salary details (employees), manage payroll (admin)

## Tech Stack

- **Framework**: Next.js 16
- **Authentication**: Clerk
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL Database**
   - Create a PostgreSQL database
   - Update the `.env` file with your database connection string:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/dayflow
     ```

3. **Initialize Database Schema**
   - Run the SQL schema from `lib/db-schema.sql` in your PostgreSQL database
   - Or use a database migration tool

4. **Configure Clerk**
   - Set up Clerk account and get your API keys
   - Add them to `.env`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
     CLERK_SECRET_KEY=your_secret
     ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Database Schema

The database includes the following tables:
- `profiles` - User profiles linked to Clerk user IDs
- `attendance` - Daily attendance records
- `leave_requests` - Leave applications and approvals
- `payroll` - Salary and payroll information

## User Roles

- **Employee**: Can view own profile, attendance, apply for leave, view payroll
- **Admin/HR**: Can manage all employees, view all attendance, approve/reject leaves, manage payroll

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:
- `DATABASE_URL` - PostgreSQL connection string
- Clerk keys (if not using environment variables from Clerk dashboard)
