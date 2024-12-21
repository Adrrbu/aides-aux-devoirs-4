import React, { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PinCodeModal: React.FC<PinCodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [hasExistingPin, setHasExistingPin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkExistingPin();
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError(false);
    }
  }, [isOpen]);

  const checkExistingPin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('parent_pin')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setHasExistingPin(!!wallet?.parent_pin);
      setIsCreatingPin(!wallet?.parent_pin);
    } catch (error) {
      console.error('Error checking PIN:', error);
      toast.error('Erreur lors de la vérification du code PIN');
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('parent_pin')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (wallet?.parent_pin === enteredPin) {
        onSuccess();
        onClose();
        toast.success('Code PIN correct');
      } else {
        setError(true);
        toast.error('Code PIN incorrect');
        setPin(['', '', '', '']);
        const firstInput = document.getElementById('pin-0');
        firstInput?.focus();
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('Erreur lors de la vérification du code PIN');
    } finally {
      setLoading(false);
    }
  };

  const createPin = async (newPin: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('wallets')
        .update({ parent_pin: newPin })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Code PIN créé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating PIN:', error);
      toast.error('Erreur lors de la création du code PIN');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;
    isConfirm ? setConfirmPin(newPin) : setPin(newPin);
    setError(false);

    // Passer automatiquement au champ suivant
    if (value && index < 3) {
      const nextInput = document.getElementById(`${isConfirm ? 'confirm-' : ''}pin-${index + 1}`);
      nextInput?.focus();
    }

    // Vérifier ou créer le code PIN lorsque tous les chiffres sont entrés
    if (index === 3 && value) {
      const enteredPin = [...newPin.slice(0, 3), value].join('');
      if (isCreatingPin) {
        if (!isConfirm) {
          const firstConfirmInput = document.getElementById('confirm-pin-0');
          firstConfirmInput?.focus();
        } else {
          const originalPin = pin.join('');
          if (originalPin === enteredPin) {
            createPin(originalPin);
          } else {
            setError(true);
            toast.error('Les codes PIN ne correspondent pas');
            setConfirmPin(['', '', '', '']);
            const firstConfirmInput = document.getElementById('confirm-pin-0');
            firstConfirmInput?.focus();
          }
        }
      } else {
        verifyPin(enteredPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`${isConfirm ? 'confirm-' : ''}pin-${index - 1}`);
      prevInput?.focus();
      const newPin = isConfirm ? [...confirmPin] : [...pin];
      newPin[index - 1] = '';
      isConfirm ? setConfirmPin(newPin) : setPin(newPin);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md border border-[#151313] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Lock className="h-6 w-6 text-[#151313] mr-2" />
            <h2 className="text-xl font-semibold text-[#151313]">
              {isCreatingPin ? 'Créer un code PIN' : 'Accès sécurisé'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600">
            {isCreatingPin 
              ? 'Veuillez créer un code PIN à 4 chiffres pour sécuriser votre cagnotte'
              : 'Veuillez entrer le code PIN parental pour accéder à la cagnotte'
            }
          </p>
        </div>

        {/* Original PIN input */}
        <div className="flex justify-center space-x-4 mb-8">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          ))}
        </div>

        {/* Confirmation PIN input when creating */}
        {isCreatingPin && (
          <>
            <div className="text-center mb-4">
              <p className="text-gray-600">Confirmez votre code PIN</p>
            </div>
            <div className="flex justify-center space-x-4 mb-8">
              {confirmPin.map((digit, index) => (
                <input
                  key={index}
                  id={`confirm-pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(index, e, true)}
                  disabled={loading}
                  className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              ))}
            </div>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {isCreatingPin ? 'Les codes PIN ne correspondent pas' : 'Code PIN incorrect'}
          </p>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Le code PIN permet de sécuriser l'accès à votre cagnotte</p>
          <p className="mt-1">Conservez-le précieusement</p>
        </div>
      </div>
    </div>
  );
};

export default PinCodeModal;