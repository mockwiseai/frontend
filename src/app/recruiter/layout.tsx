import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-white">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
