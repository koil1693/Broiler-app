import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from './Button';

const BackButton = ({ className, to }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={`gap-2 text-slate-600 hover:text-slate-900 ${className}`}
        >
            <ArrowLeft size={20} />
            Back
        </Button>
    );
};

export default BackButton;
