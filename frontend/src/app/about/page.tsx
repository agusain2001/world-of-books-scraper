import Link from 'next/link';
import {
    BookOpenIcon,
    CodeBracketIcon,
    ServerIcon,
    CubeIcon,
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const techStack = [
    {
        category: 'Frontend',
        icon: <CodeBracketIcon className="h-6 w-6" />,
        items: [
            'Next.js 14 (App Router)',
            'TypeScript',
            'Tailwind CSS',
            'React Query (TanStack Query)',
            'Zustand (State Management)',
            'Heroicons',
        ],
    },
    {
        category: 'Backend',
        icon: <ServerIcon className="h-6 w-6" />,
        items: [
            'NestJS',
            'TypeScript',
            'TypeORM',
            'PostgreSQL',
            'Swagger/OpenAPI',
            'Class Validator',
        ],
    },
    {
        category: 'Scraping',
        icon: <CubeIcon className="h-6 w-6" />,
        items: [
            'Crawlee',
            'Playwright',
            'Rate Limiting',
            'Job Queue (Bull)',
            'Caching',
        ],
    },
];

const features = [
    'Scrape navigation headings from World of Books',
    'Extract categories and subcategories',
    'Crawl product listings with pagination',
    'Fetch detailed product information',
    'Extract user reviews and ratings',
    'On-demand data refresh',
    'Intelligent caching with TTL',
    'Responsive and accessible UI',
    'Dark mode design',
    'Full-text search',
    'Advanced filtering',
    'View history tracking',
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent py-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <BookOpenIcon className="h-10 w-10 text-purple-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        World of Books Scraper
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        A full-stack web scraping application that extracts and presents book data
                        from World of Books in a beautiful, modern interface.
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-6">About This Project</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed mb-4">
                            This project is a comprehensive demonstration of modern full-stack development
                            practices, combining a powerful backend scraping engine with a beautiful,
                            responsive frontend interface.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            The application scrapes data from{' '}
                            <a
                                href="https://www.worldofbooks.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300"
                            >
                                World of Books
                            </a>{' '}
                            and presents it through a modern UI built with Next.js and Tailwind CSS.
                            The backend uses NestJS with PostgreSQL for data persistence and Crawlee
                            with Playwright for reliable web scraping.
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-6">
                            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Ethical Scraping Notice</h4>
                            <p className="text-gray-300 text-sm">
                                This project implements ethical scraping practices including rate limiting,
                                request delays, and caching to minimize impact on the source website.
                                Please ensure you comply with the website's terms of service and robots.txt.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 bg-gradient-to-b from-slate-900/50 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Tech Stack</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {techStack.map((stack) => (
                            <div
                                key={stack.category}
                                className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-4">
                                    {stack.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-4">{stack.category}</h3>
                                <ul className="space-y-2">
                                    {stack.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-gray-400">
                                            <CheckCircleIcon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                                <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* API Documentation */}
            <section className="py-16 bg-gradient-to-b from-slate-900/50 to-transparent">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-6">API Documentation</h2>
                    <p className="text-gray-300 mb-6">
                        The backend exposes a RESTful API with full Swagger documentation.
                        Access the interactive API docs at:
                    </p>
                    <a
                        href="http://localhost:3001/api/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-500/30 transition"
                    >
                        <span>Open API Documentation</span>
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="text-white font-semibold mb-4">Main Endpoints</h4>
                        <div className="space-y-2 font-mono text-sm">
                            <p className="text-gray-400">
                                <span className="text-green-400">GET</span>{' '}
                                <span className="text-white">/api/navigations</span> - Get navigation headings
                            </p>
                            <p className="text-gray-400">
                                <span className="text-green-400">GET</span>{' '}
                                <span className="text-white">/api/categories</span> - Get categories
                            </p>
                            <p className="text-gray-400">
                                <span className="text-green-400">GET</span>{' '}
                                <span className="text-white">/api/products</span> - Get products (paginated)
                            </p>
                            <p className="text-gray-400">
                                <span className="text-green-400">GET</span>{' '}
                                <span className="text-white">/api/products/:id</span> - Get product details
                            </p>
                            <p className="text-gray-400">
                                <span className="text-yellow-400">POST</span>{' '}
                                <span className="text-white">/api/scrape-jobs/navigations</span> - Scrape navigations
                            </p>
                            <p className="text-gray-400">
                                <span className="text-yellow-400">POST</span>{' '}
                                <span className="text-white">/api/scrape-jobs/categories</span> - Scrape categories
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-6">Get Started</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-2">1. Clone the repository</h4>
                            <code className="text-purple-400 text-sm">
                                git clone https://github.com/yourusername/world-of-books-scraper.git
                            </code>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-2">2. Start the database</h4>
                            <code className="text-purple-400 text-sm">
                                docker-compose up -d postgres redis
                            </code>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-2">3. Install dependencies</h4>
                            <code className="text-purple-400 text-sm">
                                cd backend && npm install && cd ../frontend && npm install
                            </code>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-2">4. Start the applications</h4>
                            <code className="text-purple-400 text-sm">
                                # Terminal 1: cd backend && npm run start:dev<br />
                                # Terminal 2: cd frontend && npm run dev
                            </code>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
                        <p className="text-gray-300 mb-6">
                            Start browsing our collection of books scraped from World of Books.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/products"
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                            >
                                Browse Products
                            </Link>
                            <Link
                                href="/categories"
                                className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition"
                            >
                                View Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
