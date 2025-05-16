import React, { HTMLProps, ReactNode } from 'react';

interface CardProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border-[3px] border-[#B0EDCA] shadow p-4 hover:shadow-transparent ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`text-gray-800 ${className}`} {...props}>
      {children}
    </div>
  );
}
