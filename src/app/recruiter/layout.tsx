import { ReactNode } from "react";
import InterviewLayout from "../live/layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
