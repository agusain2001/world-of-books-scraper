'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useNavigations } from '@/lib/queries';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: navigations, isLoading } = useNavigations();

    const mainNavLinks = [
        { href: '/', label: 'Home' },
        { href: '/categories', label: 'Categories' },
        { href: '/products', label: 'Products' },
        { href: '/about', label: 'About' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <BookOpenIcon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                            <div className="absolute inset-0 bg-purple-400/20 blur-xl group-hover:bg-purple-300/30 transition" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            World of Books
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {mainNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                    pathname === link.href
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex items-center">
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search books..."
                                className="w-64 px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {mainNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'block px-4 py-3 rounded-lg text-base font-medium transition-all',
                                    pathname === link.href
                                        ? 'bg-purple-500/20 text-purple-300'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Search */}
                        <div className="pt-4">
                            <input
                                type="search"
                                placeholder="Search books..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
