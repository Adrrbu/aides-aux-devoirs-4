import React, { useState } from 'react';
import { X, Search, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChildAdded: () => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onChildAdded
}) => {
  const [childEmail, setChildEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [step, setStep] = useState<'email' | 'pin'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childInfo, setChildInfo] = useState<any>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Vérifier si l'utilisateur existe et est un étudiant
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('email', childEmail)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          throw new Error('Aucun compte trouvé avec cet email');
        }
        throw userError;
      }

      if (userData.role !== 'student') {
        throw new Error('Ce compte n\'est pas un compte élève');
      }

      // Vérifier si la relation n'existe pas déjà
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: existingRelation } = await supabase
        .from('parent_child_relationships')
        .select('id')
        .eq('parent_id', user.id)
        .eq('child_id', userData.id)
        .single();

      if (existingRelation) {
        throw new Error('Cet enfant est déjà lié à votre compte');
      }

      setChildInfo(userData);
      setStep('pin');
    } catch (error: any) {
      console.error('Error checking child:', error);
      toast.error(error.message || 'Erreur lors de la vérification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Vérifier le code PIN
      const { data: wallet } = await supabase
        .from('wallets')
        .select('parent_pin')
        .eq('user_id', childInfo.id)
        .single();

      if (!wallet?.parent_pin || wallet.parent_pin !== pinCode) {
        throw new Error('Code PIN incorrect');
      }

      // Créer la relation parent-enfant
      const { error: relationError } = await supabase
        .from('parent_child_relationships')
        .insert([{
          parent_id: user.id,
          child_id: childInfo.id,
          child_first_name: childInfo.first_name,
          child_last_name: childInfo.last_name,
          child_avatar_url: childInfo.avatar_url,
          pin_code: pinCode
        }]);

      if (relationError) throw relationError;

      toast.success('Enfant ajouté avec succès');
      onChildAdded();
      setChildEmail('');
      setPinCode('');
      setStep('email');
      setChildInfo(null);
      onClose();
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout de l\'enfant');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md border border-[#151313]">
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#151313]">
            {step === 'email' ? 'Ajouter un enfant' : 'Vérification du code PIN'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#151313] mb-2">
                Email du compte enfant
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  placeholder="exemple@email.com"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Entrez l'adresse email du compte de votre enfant pour le lier à votre compte parent.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-[#f7f7f5]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-[#ff5734] border border-[#151313] rounded-xl hover:bg-[#ff5734]/80"
              >
                {isSubmitting ? 'Vérification...' : 'Suivant'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#151313] mb-2">
                Code PIN parental
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  placeholder="Entrez le code PIN à 4 chiffres"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Entrez le code PIN que vous avez défini sur le compte de votre enfant.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="px-4 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-[#f7f7f5]"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting || pinCode.length !== 4}
                className="px-4 py-2 text-white bg-[#ff5734] border border-[#151313] rounded-xl hover:bg-[#ff5734]/80"
              >
                {isSubmitting ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddChildModal;