# Portfolio Pro - Financial Dashboard

## Overview

Portfolio Pro is a full-stack financial portfolio management application built with modern web technologies. It provides users with real-time portfolio tracking, AI-powered trading recommendations, currency exchange monitoring, and executive profiling for investment decision-making. The application features a dark-themed, professional interface optimized for financial data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
The application follows a monorepo structure with a clear separation between client and server code:
- **Frontend**: React with TypeScript, using Vite for development and bundling
- **Backend**: Express.js with TypeScript for REST API services
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Shadcn/ui components with Tailwind CSS for styling

### Monorepo Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend services
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Frontend Architecture
- **React 18** with functional components and hooks
- **TypeScript** for type safety across the entire frontend
- **Tailwind CSS** with custom CSS variables for theming
- **Shadcn/ui** component library for consistent UI elements
- **Tanstack Query** for server state management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form handling

The frontend is organized into modular components:
- Portfolio management (watchlist, summary, positions)
- AI recommendations display
- Currency rates monitoring
- Market alerts and news
- Executive profiles
- Interactive charts and data visualization

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with clear endpoint structure
- **Modular service architecture** for business logic separation
- **Middleware** for request logging and error handling
- **Type-safe request/response** handling with Zod schema validation

Key backend services:
- **Storage Service**: Database abstraction layer
- **AI Service**: Trading recommendation generation
- **Financial Service**: Portfolio calculations and stock price management
- **Email Service**: SendGrid integration for notifications

### Database Design
PostgreSQL database with the following main entities:
- **Users**: Authentication and user management
- **Companies**: Stock ticker information and financial data
- **Portfolio Positions**: User holdings and investment tracking
- **CEO Profiles**: Executive information for investment research
- **AI Recommendations**: Generated trading signals and analysis
- **Currency Rates**: Real-time exchange rate data
- **Market Alerts**: Automated notification system
- **News Articles**: Market sentiment analysis

## Data Flow

### Real-time Updates
- Frontend queries refresh every 30-60 seconds for live data
- Portfolio values calculated in real-time with currency conversion
- AI recommendations generated based on market sentiment and technical analysis
- Email notifications sent for high-confidence trading signals

### State Management
- **Tanstack Query** handles server state with intelligent caching
- **React hooks** manage local component state
- **TypeScript interfaces** ensure type safety across data flow
- **Zod schemas** validate data at API boundaries

### API Communication
- RESTful endpoints following `/api/{resource}` pattern
- JSON request/response format with proper error handling
- Cookie-based authentication (infrastructure ready)
- Request logging and performance monitoring

## External Dependencies

### Core Technologies
- **Neon Database**: PostgreSQL hosting with serverless scaling
- **SendGrid**: Email service for trading alerts and notifications
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with hot module replacement
- **PostCSS & Autoprefixer**: CSS processing pipeline

### UI/UX Dependencies
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Efficient CSS class merging
- **CLSX**: Conditional class name utility
- **Date-fns**: Date manipulation and formatting

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Vite dev server with Express backend
- **Production Build**: `npm run build` - Vite build + ESBuild server bundling
- **Type Checking**: `npm run check` - TypeScript compilation verification
- **Database**: `npm run db:push` - Schema deployment with Drizzle

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SENDGRID_API_KEY**: Email service authentication (optional for dev)
- **SENDGRID_FROM_EMAIL**: Sender email address for notifications
- **NODE_ENV**: Environment mode (development/production)

### Hosting Architecture
- **Static Assets**: Frontend built to `dist/public` for CDN serving
- **API Server**: Express.js bundle in `dist/index.js` for Node.js hosting
- **Database**: Neon PostgreSQL with connection pooling
- **Email Service**: SendGrid with fallback logging for development

The application is designed for cloud deployment with environment-based configuration and graceful degradation when external services are unavailable.