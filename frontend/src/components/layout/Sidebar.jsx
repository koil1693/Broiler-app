import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Truck,
    Users,
    DollarSign,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { path: '/dispatch', label: t('dispatch'), icon: Truck },
        { path: '/vendors', label: t('vendors'), icon: Users },
        { path: '/drivers', label: 'Drivers', icon: User },
        { path: '/rates', label: t('rates'), icon: DollarSign },
        { path: '/reconciliation', label: t('reconciliation'), icon: FileText },
        { path: '/daily-overview', label: t('daily_overview'), icon: Calendar },
        { path: '/payments/entry', label: t('record_payment'), icon: DollarSign },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div
            className={cn(
                'h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                {!collapsed && <h1 className="text-xl font-bold">Broiler Admin</h1>}
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <Icon size={20} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
}
