# Birrapp

A beer consumption tracking dashboard for friends. Track your daily beer intake, compare stats with your group, and visualize drinking patterns over time.

## Features

- **Personal Dashboard**: View your beer consumption stats including total beers, daily average, and active days
- **Evolution Charts**: Visualize consumption over time with daily, weekly, and monthly views
- **Range Distribution**: See how your drinking days are distributed across different consumption levels
- **Streak Tracking**: Track your longest drinking streaks and dry spells
- **Group Rankings**: Compare your stats with friends on a leaderboard
- **Year Comparison**: Compare your current year's consumption with previous years
- **Multi-user Support**: Switch between users to view different profiles

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

### Database Setup

Run the migrations in order on your Supabase project:

1. `supabase/migrations/001_initial_schema.sql` - Creates tables for profiles and beer entries
2. `supabase/migrations/002_rls_policies.sql` - Sets up Row Level Security policies
3. `supabase/migrations/003_views.sql` - Creates views for statistics and analytics

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── dashboard/      # Main dashboard page
│   ├── login/          # Authentication page
│   └── auth/           # Auth callback handlers
├── components/
│   ├── dashboard/      # Dashboard widgets and cards
│   ├── layout/         # Header, Sidebar, Navigation
│   ├── sections/       # Page sections
│   └── ui/             # Reusable UI components
└── lib/
    ├── supabase/       # Supabase client configuration
    ├── data.ts         # Static data and constants
    └── types.ts        # TypeScript type definitions
```

## Database Schema

### Tables

- **profiles**: User information (id, name, color)
- **beer_entries**: Daily beer consumption records (user_id, date, beers)

### Views

- **user_yearly_stats**: Aggregated yearly statistics per user
- **yearly_ranking**: Leaderboard rankings by year
- **user_weekday_stats**: Consumption patterns by day of week
- **user_monthly_stats**: Monthly consumption breakdown
- **user_range_distribution**: Distribution of consumption levels
- **group_yearly_stats**: Group-wide statistics

## License

MIT
