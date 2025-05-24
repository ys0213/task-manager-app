import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    showPlusIcon?: boolean;
}

const AddButton = ({
    children,
    onClick,
    className = '',
    showPlusIcon = false,
    ...props
}: AddButtonProps) => {
    return (
        <button
        onClick={onClick}
        className={`
            flex items-center justify-center gap-2 
            bg-[#F9E79F] 
            text-[#333333] 
            font-medium 
            text-base 
            py-4 px-8 
            rounded-full 
            transition 
            duration-150
            w-full
            ${className}
        `}
        {...props}
        >
        {showPlusIcon && <Plus size={16} strokeWidth={2} />}
        {children}
        </button>
    );
};

export default AddButton;
