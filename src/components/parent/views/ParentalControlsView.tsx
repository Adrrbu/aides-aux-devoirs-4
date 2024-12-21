import React, { useState, useEffect } from 'react';
import { Shield, Clock, Coins, ShoppingBag, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { GIFT_CARDS } from '../../store/constants/giftCards';

interface ParentalControls {
  max_study_time_daily: number;
  max_tokens_weekly: number;
  allowed_gift_card_categories: string[];
  max_purchase_amount: number;
  require_approval_above: number;
}

const ParentalControlsView: React.FC = () => {
  const [controls, setControls] = useState<ParentalControls>({
    max_study_time_daily: 120,
    max_tokens_weekly: 50,
    allowed_gift_card_categories: ['gaming', 'entertainment', 'shopping'],
    max_purchase_amount: 50,
    require_approval_above: 20
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('parental_controls')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setControls(data);
    } catch (error) {
      console.error('Error loading controls:', error);
      toast.error('Erreur lors du chargement des paramètres');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('parental_controls')
        .upsert({
          user_id: user.id,
          ...controls,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error saving controls:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#151313]">Garde-fous</h2>
          <p className="text-gray-600">
            Configurez les limites et restrictions pour vos enfants
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
            isSubmitting ? 'bg-gray-400' : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
          }`}
        >
          <Save className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Study Time Controls */}
      <div className={cardClasses}>
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-[#ff5734] mr-3" />
          <h3 className="text-lg font-medium text-[#151313]">Temps de révision</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Temps maximum de révision par jour
            </label>
            <select
              value={controls.max_study_time_daily}
              onChange={(e) => setControls({ ...controls, max_study_time_daily: parseInt(e.target.value) })}
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            >
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
              <option value="180">3 heures</option>
              <option value="240">4 heures</option>
              <option value="300">5 heures</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rewards Controls */}
      <div className={cardClasses}>
        <div className="flex items-center mb-6">
          <Coins className="h-6 w-6 text-[#be94f5] mr-3" />
          <h3 className="text-lg font-medium text-[#151313]">Récompenses</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Maximum d'izicoins gagnés par semaine
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={controls.max_tokens_weekly}
              onChange={(e) => setControls({ ...controls, max_tokens_weekly: parseInt(e.target.value) })}
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Montant maximum d'achat sans approbation
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={controls.require_approval_above}
              onChange={(e) => setControls({ ...controls, require_approval_above: parseInt(e.target.value) })}
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            />
            <p className="mt-1 text-sm text-gray-500">
              Les achats au-dessus de ce montant nécessiteront votre approbation
            </p>
          </div>
        </div>
      </div>

      {/* Store Controls */}
      <div className={cardClasses}>
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 text-[#fccc42] mr-3" />
          <h3 className="text-lg font-medium text-[#151313]">Magasin</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Catégories de cartes cadeaux autorisées
            </label>
            <div className="space-y-2">
              {['gaming', 'entertainment', 'shopping'].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={controls.allowed_gift_card_categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...controls.allowed_gift_card_categories, category]
                        : controls.allowed_gift_card_categories.filter(c => c !== category);
                      setControls({ ...controls, allowed_gift_card_categories: newCategories });
                    }}
                    className="rounded border-[#151313] text-[#ff5734] focus:ring-[#ff5734]"
                  />
                  <span className="ml-2 text-[#151313] capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Montant maximum par achat
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={controls.max_purchase_amount}
              onChange={(e) => setControls({ ...controls, max_purchase_amount: parseInt(e.target.value) })}
              className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalControlsView;