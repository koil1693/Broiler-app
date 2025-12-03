import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t, i18n } = useTranslation();

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left side: Logo and main navigation */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 text-white font-bold">
                            Broiler Management
                        </div>
                        <div className="hidden md:block"> {/* Main navigation links - hidden on small screens */}
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/dashboard" className={linkClass}>{t('dashboard')}</NavLink>
                                <NavLink to="/dispatch" className={linkClass}>{t('dispatch')}</NavLink>
                                <NavLink to="/rates" className={linkClass}>{t('rates')}</NavLink>
                                <NavLink to="/vendors" className={linkClass}>{t('vendors')}</NavLink>
                                <NavLink to="/drivers" className={linkClass}>Drivers</NavLink>
                                <NavLink to="/reconciliation" className={linkClass}>{t('reconciliation')}</NavLink>
                                <NavLink to="/daily-overview" className={linkClass}>{t('daily_overview')}</NavLink>
                                <NavLink to="/payments/entry" className={linkClass}>{t('record_payment')}</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Language Selector and Profile Icon */}
                    <div className="flex items-center"> {/* This div should always be visible */}
                        {/* Language Selector */}
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-white"
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                        </select>

                        {/* Profile Icon Placeholder */}
                        <div className="ml-4 flex-shrink-0">
                            <button
                                type="button"
                                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            >
                                <span className="sr-only">View user menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
