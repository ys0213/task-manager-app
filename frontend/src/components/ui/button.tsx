import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, onClick, className = '', ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
        className={`
        inline-block 
        rounded-full 
        p-5
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
