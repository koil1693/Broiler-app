import React from 'react';
import { cn } from '../../utils/cn';

export default function Input({ label, error, className, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg border border-slate-300',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200',
                    'placeholder:text-slate-400',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
