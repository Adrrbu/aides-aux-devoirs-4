import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  onToggleForm: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('Starting signup process...');

      // 1. Créer l'utilisateur dans Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'student'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Aucune donnée utilisateur retournée');

      console.log('User created in Auth:', data.user);

      // 2. Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('users')
        .upsert([{
          id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'student',
          has_completed_onboarding: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      console.log('User profile created successfully');

      // 3. Créer le wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .insert([{
          user_id: data.user.id,
          balance: 0,
          created_at: new Date().toISOString()
        }]);

      if (walletError) {
        console.error('Wallet creation error:', walletError);
        throw walletError;
      }

      console.log('Wallet created successfully');

      toast.success('Compte créé avec succès ! Vérifiez votre email.');
      onToggleForm();
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
      <div className="text-center mb-6">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-[#ff5734]" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[#151313]">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez Aizily pour commencer votre apprentissage
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">Prénom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="sr-only">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Mot de passe (minimum 6 caractères)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {isLoading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onToggleForm}
          className="text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;