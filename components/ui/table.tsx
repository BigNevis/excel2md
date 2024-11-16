import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className || ""}`}>
      <table className="min-w-full divide-y divide-white/10">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: TableProps) {
  return <thead className="bg-black/40">{children}</thead>;
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-white/10">{children}</tbody>;
}

export function TableRow({ children }: TableProps) {
  return <tr className="hover:bg-white/5 transition-colors">{children}</tr>;
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${className || ""}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableProps) {
  return <td className={`px-6 py-4 whitespace-nowrap text-white ${className || ""}`}>{children}</td>;
}