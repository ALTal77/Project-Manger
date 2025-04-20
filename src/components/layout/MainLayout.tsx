import type React from "react";
import { Toaster } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 shadow-sm">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <svg
                width="26"
                height="26"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
              >
                <rect width="32" height="32" rx="4" fill="#3B82F6" />
                <rect x="6" y="8" width="14" height="3" rx="1" fill="white" />
                <rect x="6" y="14" width="20" height="3" rx="1" fill="white" />
                <rect x="6" y="20" width="10" height="3" rx="1" fill="white" />
                <circle cx="24" cy="9.5" r="3.5" fill="#10B981" stroke="white" strokeWidth="1" />
              </svg>
              <span className="hidden font-bold sm:inline-block">
                Project & Team Manager
              </span>
            </a>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <Toaster position="top-right" closeButton />
    </div>
  );
};

export default MainLayout;
