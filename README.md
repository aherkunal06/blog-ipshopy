# Blog Application - MySQL Version

This is a production-ready Next.js blog application using MySQL directly (without Prisma ORM).

## Features

- Next.js 15.3.4 with App Router
- MySQL database with connection pooling
- NextAuth for authentication (user and admin)
- Cloudinary for image uploads
- Material-UI and Tailwind CSS for styling
- TypeScript for type safety
- Production-ready database connection management

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Cloudinary account (for image uploads)

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run the SQL schema file to create all tables:
```bash
mysql -u your_username -p blog_db < database/schema.sql
```

Or manually execute the SQL file `database/schema.sql` in your MySQL client.

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Base URL for password reset emails
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The database schema includes the following tables:

- `User` - Regular users
- `AdminUser` - Admin users with roles
- `Blog` - Blog posts
- `Category` - Blog categories
- `BlogCategory` - Many-to-many relationship between blogs and categories
- `FAQ` - FAQs for blogs
- `BlogRelation` - Related articles
- `Like` - User likes on blogs
- `Favorite` - User favorites
- `Comment` - User comments
- `Account` - OAuth accounts (NextAuth)
- `PasswordResetToken` - Password reset tokens for admins
- `InformationPrivacyPolicy` - Privacy policy and terms
- `information` - General information entries

## Project Structure

```
blog.ipshopy-mysql/
├── database/
│   └── schema.sql          # MySQL database schema
├── src/
│   ├── app/
│   │   ├── api/            # API routes (converted from Prisma to MySQL)
│   │   ├── admin/          # Admin pages
│   │   ├── auth/           # Authentication pages
│   │   └── (site)/         # Public site pages
│   ├── components/         # React components
│   ├── lib/
│   │   └── db.ts           # MySQL connection and query helpers
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

## Key Differences from Prisma Version

1. **Database Access**: Uses `mysql2` package with connection pooling instead of Prisma Client
2. **Queries**: Raw SQL queries instead of Prisma query builder
3. **Transactions**: Custom transaction helper using MySQL connection pooling
4. **Type Safety**: Manual type definitions for query results

## Database Connection

The database connection is managed in `src/lib/db.ts` with:
- Connection pooling for production
- Automatic connection management
- Transaction support
- Helper functions for common operations

## Production Deployment

1. Set up environment variables in your hosting platform
2. Ensure MySQL database is accessible
3. Run database migrations (execute `database/schema.sql`)
4. Build the application:
   ```bash
   npm run build
   ```
5. Start the production server:
   ```bash
   npm start
   ```

## Improvements Over Original

- Production-ready connection pooling
- Better error handling
- Optimized SQL queries
- Proper transaction support
- No ORM overhead
- Direct database control

## License

Same as the original project.

