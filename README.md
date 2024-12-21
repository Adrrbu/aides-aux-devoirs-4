# Aizily Education Platform

A modern educational platform built with React, TypeScript, and Vite, featuring real-time interactions, video content, and payment integration.

## Features

- 📚 Interactive learning platform
- 💳 Stripe payment integration
- 📊 Progress tracking with Chart.js
- 📧 Email notifications via EmailJS
- 🎥 Video content support with React Player
- 🔐 User authentication with Supabase
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Stripe account (for payments)
- EmailJS account (for notifications)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Local Development

### Setting up Supabase

You can either use Supabase locally or the cloud service.

#### Option 1: Supabase Cloud (Recommended for Production)

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project and note down your project URL and anon key
3. Update your `.env` with the cloud credentials:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-project-anon-key
```

### Database Setup

1. Navigate to your Supabase project dashboard
2. Go to the SQL editor and create the following tables:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('student', 'teacher', 'admin')) not null default 'student'
);

-- Courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  instructor_id uuid references public.profiles(id) not null,
  price decimal(10,2) not null,
  published boolean default false
);

-- Enrollments table
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  progress integer default 0,
  completed boolean default false,
  unique(user_id, course_id)
);
```

3. Set up Row Level Security (RLS) policies:

```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Courses policies
create policy "Courses are viewable by everyone"
  on public.courses for select
  using ( true );

create policy "Instructors can create courses"
  on public.courses for insert
  using ( auth.uid() in (
    select id from public.profiles where role = 'teacher'
  ));

-- Enrollments policies
create policy "Students can view own enrollments"
  on public.enrollments for select
  using ( auth.uid() = user_id );

create policy "Students can enroll in courses"
  on public.enrollments for insert
  using ( auth.uid() = user_id );
```

### Authentication Setup

1. Configure Authentication providers in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Email provider (default)
   - Optionally enable OAuth providers (Google, GitHub, etc.)

2. Configure Email Templates:
   - Go to Authentication > Email Templates
   - Customize confirmation, reset password, and magic link emails
   - Update sender name and email address

### Storage Setup

1. Create storage buckets:
   - Go to Storage in Supabase Dashboard
   - Create buckets for:
     - `course-thumbnails`
     - `user-avatars`
     - `course-materials`

2. Set up storage policies:
```sql
-- Course thumbnails accessible by everyone
create policy "Course thumbnails are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'course-thumbnails' );

-- Allow instructors to upload course thumbnails
create policy "Instructors can upload course thumbnails"
  on storage.objects for insert
  using (
    bucket_id = 'course-thumbnails'
    and auth.uid() in (
      select id from public.profiles where role = 'teacher'
    )
  );

-- Users can access their own avatars
create policy "Users can access own avatars"
  on storage.objects for select
  using (
    bucket_id = 'user-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Edge Functions (Optional)

For serverless functionality:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Initialize Supabase functions:
```bash
supabase init
supabase functions new my-function
```

3. Deploy functions:
```bash
supabase functions deploy my-function
```

### Monitoring and Maintenance

1. Set up monitoring:
   - Go to Database > Monitoring
   - Configure performance alerts
   - Set up error notifications

2. Regular maintenance:
   - Monitor database size and connection limits
   - Review and optimize slow queries
   - Set up database backups
   - Keep track of usage metrics

### Production Considerations

1. Upgrade to an appropriate tier based on:
   - Number of database connections
   - Storage requirements
   - Bandwidth usage
   - Authentication requirements

2. Enable additional security features:
   - Database encryption
   - SSL enforcement
   - Network restrictions
   - JWT expiry times

3. Set up CI/CD:
   - Use Supabase CLI in your pipeline
   - Automate database migrations
   - Test RLS policies

### Running the Application

1. Clone the repository:

```bash
git clone https://github.com/yourusername/aizily-education.git
cd aizily-education
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Production Deployment

1. Build the application:

```bash
npm run build
# or
yarn build
```

2. Preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

### Server Requirements

- Node.js runtime environment
- SSL certificate for secure connections
- Environment variables configured on the hosting platform
- Database connection (Supabase)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Stripe
- Chart.js
- EmailJS
- OpenAI API
- React Player

## License

[MIT License](LICENSE)

## Last Updated

December 19, 2024
