import React from 'react';
import { cn } from '../../utils/cn';

export default function Table({ children, className, ...props }) {
    return (
        <div className="overflow-x-auto">
            <table
                className={cn('w-full border-collapse', className)}
                {...props}
            >
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children, className, ...props }) {
    return (
        <thead
            className={cn('bg-slate-50 border-b border-slate-200', className)}
            {...props}
        >
            {children}
        </thead>
    );
}

export function TableBody({ children, className, ...props }) {
    return (
        <tbody className={cn('divide-y divide-slate-200', className)} {...props}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, className, ...props }) {
    return (
        <tr
            className={cn('hover:bg-slate-50 transition-colors', className)}
            {...props}
        >
            {children}
        </tr>
    );
}

export function TableHead({ children, className, ...props }) {
    return (
        <th
            className={cn(
                'px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider',
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className, ...props }) {
    return (
        <td
            className={cn('px-6 py-4 text-sm text-slate-800', className)}
            {...props}
        >
            {children}
        </td>
    );
}
