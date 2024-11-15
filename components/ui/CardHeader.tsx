import React from 'react';

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b p-4">{children}</div>;
}
