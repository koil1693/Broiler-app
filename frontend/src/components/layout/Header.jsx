import React from 'react';
import { Bell, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t, i18n } = useTranslation();
    const username = localStorage.getItem('username') || 'Admin';

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">{t('dashboard')}</h2>
                <p className="text-sm text-slate-500">{t('manage_daily_trips')}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${i18n.language === 'en' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage('ta')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${i18n.language === 'ta' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        தமிழ்
                    </button>
                </div>

                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-primary-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">{username}</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
