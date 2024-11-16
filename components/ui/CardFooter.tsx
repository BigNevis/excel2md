import React from 'react';

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={`p-4 border-t ${className || ''}`}>
      {children}
    </div>
  );
}
