import React, { useState } from 'react';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface ParentLoginFormProps {
  onToggleForm: () => void;
}

const ParentLoginForm: React.FC<ParentLoginFormProps> = ({ onToggleForm }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password, 'parent');
      if (result?.success) {
        toast.success('Connexion réussie !');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <BookOpen className="h-12 w-12 text-[#ff5734]" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-[#151313]">Espace Parent</h2>
        <p className="mt-2 text-sm text-gray-600">
          Suivez les progrès de vos enfants et gérez leur cagnotte
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-[#151313] text-sm font-medium rounded-xl text-white ${
              isLoading ? 'bg-gray-400' : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5734] transition-colors duration-200`}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleForm}
          className="text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Espace élève
        </button>
      </div>
    </div>
  );
};

export default ParentLoginForm;