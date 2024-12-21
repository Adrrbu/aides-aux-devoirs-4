import React from 'react';
import { BookOpen } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-[#ff5734]" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-[#151313]">Aizily</h1>
          <p className="mt-2 text-sm text-gray-600">
            Le soutien scolaire intelligent pour votre enfant
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;