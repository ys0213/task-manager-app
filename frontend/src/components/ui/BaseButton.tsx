import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    // label: string;
    // icon: string;
}

export function BaseButton({ children, onClick, className = '', ...props }: BaseButtonProps) {
    return (
        <button
        onClick={onClick}
            className={`
            ml-2 
            p-3
            text-xs 
            sm:text-sm 
            whitespace-nowrap
            cursor-pointer
            inline-block 
            rounded-full 
            text-sm font-bold 
            text-[#333333] 
            bg-white 
            border border-[#58D68D] 
            hover:bg-[#B0EDCA] 
            hover:text-white 
            hover:border-transparent
            focus:outline-none 
            focus:ring-2 
            focus:ring-offset-2 
            focus:ring-[#B0EDCA]
            transition 
            transform 
            focus:scale-95 
            duration-150 ${className}`}
        {...props}
        >
        {children}
        </button>
    );
}
