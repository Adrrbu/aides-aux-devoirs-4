import React, { useState } from 'react';
import AuthLayout from './auth/AuthLayout';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <AuthLayout>
      {isLoginMode ? (
        <LoginForm onToggleForm={() => setIsLoginMode(false)} />
      ) : (
        <SignUpForm onToggleForm={() => setIsLoginMode(true)} />
      )}
    </AuthLayout>
  );
};

export default LoginPage;