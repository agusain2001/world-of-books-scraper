---
description: Build the World of Books Scraper Full-Stack Application
---

# World of Books Scraper - Build Workflow

// turbo-all

## Phase 1: Project Setup

1. Create project directories for frontend and backend
2. Initialize Next.js frontend with TypeScript and Tailwind CSS
3. Initialize NestJS backend with TypeScript
4. Set up PostgreSQL database schema

## Phase 2: Backend Development

1. Create database entities (navigation, category, product, product_detail, review, scrape_job, view_history)
2. Set up Crawlee + Playwright scraping service
3. Create REST API endpoints for all entities
4. Implement queue/worker model for scrape jobs
5. Add rate limiting and caching

## Phase 3: Frontend Development

1. Create landing page with navigation headings
2. Build category drilldown pages
3. Implement product grid with pagination
4. Create product detail page
5. Add responsive design and accessibility

## Phase 4: Integration & Testing

1. Connect frontend to backend APIs
2. Add unit and integration tests
3. Set up CI/CD pipeline
4. Deploy to production

## Phase 5: Documentation

1. Write README with architecture overview
2. Create API documentation
3. Add database schema documentation
4. Include deployment instructions
