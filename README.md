# World of Books Scraper

A full-stack web scraping application that extracts and presents book data from [World of Books](https://www.worldofbooks.com/) through a modern, responsive interface.

![Project Banner](https://via.placeholder.com/1200x400/1e1b4b/a855f7?text=World+of+Books+Scraper)

## 🚀 Features

### Frontend
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive for desktop and mobile
- **Dark Mode**: Beautiful dark theme with glassmorphism effects
- **Real-time Data**: React Query for efficient data fetching and caching
- **Search & Filters**: Full-text search with advanced filtering options
- **Skeleton Loading**: Smooth loading states for better UX
- **Accessibility**: WCAG AA compliant with semantic HTML

### Backend
- **NestJS Framework**: Production-ready Node.js backend
- **PostgreSQL Database**: Reliable data persistence with TypeORM
- **RESTful API**: Full CRUD operations with Swagger documentation
- **Web Scraping**: Crawlee + Playwright for reliable scraping
- **Rate Limiting**: Ethical scraping with request delays
- **Job Queue**: Background processing for long-running scrapes
- **Caching**: TTL-based caching to reduce scraping frequency

### Scraping Capabilities
- Navigation headings extraction
- Category and subcategory discovery
- Product listing with pagination
- Product detail extraction (description, specs, ISBN, etc.)
- User reviews and ratings
- Related/recommended products

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Zustand (State Management)
- Axios

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger/OpenAPI
- Crawlee + Playwright
- Bull (Job Queue)
- Redis

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- Redis (optional, for job queue)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/world-of-books-scraper.git
cd world-of-books-scraper

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

### Manual Setup

#### 1. Database Setup

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Or install them locally and create the database
createdb worldofbooks
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=worldofbooks

# Run in development mode
npm run start:dev
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Run in development mode
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `DATABASE_NAME` | Database name | `worldofbooks` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `SCRAPE_BASE_URL` | Target website URL | `https://www.worldofbooks.com` |
| `SCRAPE_DELAY_MS` | Delay between requests | `2000` |
| `CACHE_TTL_HOURS` | Cache expiry in hours | `24` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

## 📚 API Documentation

Access the interactive Swagger documentation at:
```
http://localhost:3001/api/docs
```

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/navigations` | Get all navigation headings |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| GET | `/api/products` | Get products (paginated, filterable) |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/reviews/product/:id` | Get product reviews |
| POST | `/api/scrape-jobs/navigations` | Scrape navigations |
| POST | `/api/scrape-jobs/categories` | Scrape categories |
| POST | `/api/scrape-jobs/products/:slug` | Scrape products in category |
| POST | `/api/scrape-jobs/product-detail/:id` | Scrape product details |

## 📁 Project Structure

```
world-of-books-scraper/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── categories/      # Category pages
│   │   │   ├── products/        # Product pages
│   │   │   └── about/           # About page
│   │   ├── components/          # React components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── ui/              # UI primitives
│   │   │   ├── products/        # Product components
│   │   │   └── categories/      # Category components
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # API client
│   │   │   ├── queries.ts       # React Query hooks
│   │   │   └── utils.ts         # Helper functions
│   │   └── types/               # TypeScript types
│   └── Dockerfile
│
├── backend/                     # NestJS backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   ├── entities/            # TypeORM entities
│   │   └── modules/             # Feature modules
│   │       ├── navigation/      # Navigation CRUD
│   │       ├── category/        # Category CRUD
│   │       ├── product/         # Product CRUD
│   │       ├── review/          # Review CRUD
│   │       ├── scraper/         # Scraping service
│   │       └── view-history/    # View tracking
│   └── Dockerfile
│
├── docker-compose.yml           # Docker orchestration
├── IMPLEMENTATION_PLAN.md       # Detailed implementation plan
└── README.md                    # This file
```

## 🗄️ Database Schema

### Entities

- **Navigation**: Top-level navigation items
- **Category**: Hierarchical categories (self-referencing)
- **Product**: Book products with basic info
- **ProductDetail**: Extended product information
- **Review**: User reviews and ratings
- **ScrapeJob**: Job tracking for scrapes
- **ViewHistory**: User browsing history

### Relationships

```
Navigation (1) ──> (N) Category
Category (1) ──> (N) Category (parent-child)
Category (1) ──> (N) Product
Product (1) ──> (1) ProductDetail
Product (1) ──> (N) Review
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage report

# Frontend tests
cd frontend
npm run test           # Run tests
```

## 🚢 Deployment

### Using Docker

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Manual Deployment

#### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

#### Backend (Railway/Render)

1. Connect your repository
2. Set environment variables (see table above)
3. Ensure PostgreSQL and Redis are provisioned

## ⚠️ Ethical Scraping

This project implements ethical scraping practices:

- **Rate Limiting**: 30 requests per minute max
- **Request Delays**: 2 second delay between requests
- **Caching**: 24-hour cache to minimize requests
- **Respect robots.txt**: Check and comply with site rules
- **User-Agent**: Proper identification in requests

Please ensure you comply with the target website's terms of service.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js, NestJS, and Tailwind CSS
