import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef(({ children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'bg-white rounded-xl shadow-glass border border-slate-200/50 backdrop-blur-sm',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

export default Card;

export function CardHeader({ children, className, ...props }) {
    return (
        <div
            className={cn('px-6 py-4 border-b border-slate-200', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardBody({ children, className, ...props }) {
    return (
        <div className={cn('px-6 py-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }) {
    return (
        <h3
            className={cn('text-xl font-semibold text-slate-800', className)}
            {...props}
        >
            {children}
        </h3>
    );
}
