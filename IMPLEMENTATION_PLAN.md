# World of Books Scraper - Implementation Plan

## Project Overview

A full-stack web scraping application that extracts product data from World of Books (https://www.worldofbooks.com/) and presents it through a modern, responsive UI.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│              (Next.js 14 + TypeScript + Tailwind)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Landing │ │ Category │ │ Products │ │  Product Detail  │   │
│  │   Page   │ │ Drilldown│ │   Grid   │ │ (Reviews, Recs)  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                         ↕ React Query/SWR                       │
└─────────────────────────────────────────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                    (NestJS + TypeScript)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │   API    │ │  Queue   │ │  Cache   │ │    Scraper       │   │
│  │ Gateway  │ │  Worker  │ │  Layer   │ │ (Crawlee+Playwrt)│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                         ↕ TypeORM                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                  │
│                      (PostgreSQL)                               │
│  navigation │ category │ product │ product_detail │ review     │
│  scrape_job │ view_history                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

1. **navigation** - Top-level navigation items
2. **category** - Categories with parent-child relationships
3. **product** - Product tiles/cards
4. **product_detail** - Extended product information
5. **review** - User reviews for products
6. **scrape_job** - Job tracking for scrapes
7. **view_history** - User browsing history

## API Endpoints

### Navigation
- `GET /api/navigations` - Get all navigation headings
- `GET /api/navigations/:slug` - Get navigation by slug

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with subcategories
- `POST /api/categories/:slug/scrape` - Trigger category scrape

### Products
- `GET /api/products` - Get products (paginated, filterable)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/details` - Get product details
- `POST /api/products/:id/scrape` - Trigger product detail scrape

### Reviews
- `GET /api/products/:id/reviews` - Get reviews for product

### Scrape Jobs
- `GET /api/scrape-jobs` - Get all scrape jobs
- `GET /api/scrape-jobs/:id` - Get scrape job status
- `POST /api/scrape-jobs` - Create new scrape job

### View History
- `GET /api/view-history` - Get user's view history
- `POST /api/view-history` - Record view

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: Zustand
- **UI Components**: Custom + Headless UI

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Queue**: Bull (Redis-backed)
- **Scraping**: Crawlee + Playwright
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render

## Implementation Phases

### Phase 1: Project Setup (Day 1)
- [ ] Initialize monorepo structure
- [ ] Set up Next.js frontend
- [ ] Set up NestJS backend
- [ ] Configure PostgreSQL with Docker
- [ ] Set up TypeORM entities

### Phase 2: Backend Core (Day 2-3)
- [ ] Implement database entities
- [ ] Create CRUD services
- [ ] Build REST API endpoints
- [ ] Add validation and error handling
- [ ] Implement Crawlee scraper

### Phase 3: Scraping Engine (Day 3-4)
- [ ] Build navigation scraper
- [ ] Build category scraper
- [ ] Build product scraper
- [ ] Build product detail scraper
- [ ] Implement queue/worker system
- [ ] Add rate limiting and caching

### Phase 4: Frontend Core (Day 4-5)
- [ ] Create landing page
- [ ] Build category pages
- [ ] Implement product grid
- [ ] Create product detail page
- [ ] Add responsive design

### Phase 5: Polish & Deploy (Day 6)
- [ ] Add loading states/skeletons
- [ ] Implement error handling
- [ ] Add accessibility features
- [ ] Write tests
- [ ] Deploy to production
- [ ] Write documentation

## Directory Structure

```
web-scrapping/
├── frontend/
│   ├── app/
│   │   ├── (routes)/
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── categories/
│   │   │   │   └── [slug]/page.tsx      # Category page
│   │   │   ├── products/
│   │   │   │   └── [id]/page.tsx        # Product detail
│   │   │   └── about/page.tsx           # About page
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # Base UI components
│   │   ├── navigation/                  # Nav components
│   │   ├── products/                    # Product components
│   │   └── layout/                      # Layout components
│   ├── lib/
│   │   ├── api.ts                       # API client
│   │   ├── queries.ts                   # React Query hooks
│   │   └── utils.ts                     # Utility functions
│   ├── types/                           # TypeScript types
│   └── public/                          # Static assets
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── navigation/              # Navigation module
│   │   │   ├── category/                # Category module
│   │   │   ├── product/                 # Product module
│   │   │   ├── review/                  # Review module
│   │   │   ├── scraper/                 # Scraper module
│   │   │   └── view-history/            # View history module
│   │   ├── common/                      # Shared utilities
│   │   ├── config/                      # Configuration
│   │   └── main.ts                      # Entry point
│   ├── test/                            # Tests
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .github/
    └── workflows/
        └── ci.yml
```
