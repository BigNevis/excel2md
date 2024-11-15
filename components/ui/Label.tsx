import React from 'react';

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-gray-700">{children}</label>;
}
