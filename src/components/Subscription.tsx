import React from 'react';
import { Brain, BookOpen, Video, Calendar, Check, BookOpenCheck, Target, Trophy, Sparkles } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '../lib/stripe';
import { stripePromise } from '../lib/stripe/config';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Subscription: React.FC = () => {
  const handleSubscribe = async (priceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour souscrire');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Erreur lors de l\'initialisation du paiement');
        return;
      }

      // Rediriger vers la page de paiement Stripe
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/canceled',
        customerEmail: user.email
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('Erreur lors de l\'initialisation de l\'abonnement');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center">
      <div className="max-w-[1600px] mx-auto px-8 py-12 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Plans - Maintenant sur 9 colonnes */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Découverte */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#151313] relative transition-all duration-300 hover:border-[#ff5734]">
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#151313] text-center">
                    Découverte
                  </h3>
                  <p className="mt-1 text-center text-gray-500 text-sm">
                    Pour découvrir la plateforme
                  </p>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-4xl font-extrabold text-[#151313]">
                      0€
                    </span>
                    <span className="ml-1 text-lg text-gray-500">
                      /mois
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Accès limité aux exercices</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Assistant IA (10 questions/mois)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Stockage de documents (100 Mo)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Fiches de révision basiques</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Support par email</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Accès aux cours standards</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Suivi de progression basique</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Calendrier de révision simple</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.DECOUVERTE.priceId)}
                    className="mt-6 w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 border border-[#151313] bg-white text-[#151313] hover:bg-[#f7f7f5]"
                  >
                    Commencer gratuitement
                  </button>
                </div>
              </div>

              {/* Plan Excellence */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#ff5734] relative transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-2 bg-[#ff5734] rounded-t-2xl"></div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#151313] text-center">
                    Excellence
                  </h3>
                  <p className="mt-1 text-center text-gray-500 text-sm">
                    La formule la plus populaire
                  </p>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-4xl font-extrabold text-[#151313]">
                      9,90€
                    </span>
                    <span className="ml-1 text-lg text-gray-500">
                      /mois
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Accès illimité aux exercices</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Assistant IA (100 questions/mois)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Stockage de documents (1 Go)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Fiches de révision avancées</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Vidéos éducatives</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Plan de révision personnalisé</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Support prioritaire</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Suivi détaillé des progrès</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Exercices personnalisés</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Quiz adaptatifs</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.EXCELLENCE.priceId)}
                    className="mt-6 w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 border border-[#151313] bg-[#ff5734] text-white hover:bg-[#ff5734]/80"
                  >
                    Choisir Excellence
                  </button>
                </div>
              </div>

              {/* Plan Elite */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#151313] relative transition-all duration-300 hover:border-[#ff5734]">
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#151313] text-center">
                    Elite
                  </h3>
                  <p className="mt-1 text-center text-gray-500 text-sm">
                    Pour les étudiants ambitieux
                  </p>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-4xl font-extrabold text-[#151313]">
                      19,90€
                    </span>
                    <span className="ml-1 text-lg text-gray-500">
                      /mois
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Tous les avantages Excellence</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Assistant IA illimité</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Stockage de documents (5 Go)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Tutorat personnalisé (2h/mois)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Cours particuliers en visio</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Préparation aux examens</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Contenus exclusifs avancés</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Exercices corrigés détaillés</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Objectifs personnalisés</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ff5734] mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Support prioritaire 7j/7</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.ELITE.priceId)}
                    className="mt-6 w-full py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 border border-[#151313] bg-white text-[#151313] hover:bg-[#f7f7f5]"
                  >
                    Choisir Elite
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Maintenant sur 3 colonnes et collé à droite */}
          <div className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-8">
              <h1 className="text-3xl font-bold text-[#151313] mb-4">
                Réussissez vos études avec Aizily
              </h1>
              <p className="text-base text-gray-600 mb-8">
                Découvrez nos formules adaptées à vos besoins et bénéficiez d'un accompagnement personnalisé pour atteindre vos objectifs scolaires.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#ff5734]">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-[#151313]">Assistant IA personnalisé</h3>
                    <p className="mt-1 text-xs text-gray-600">Un assistant disponible 24/7 pour répondre à toutes vos questions et vous aider dans vos révisions.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#be94f5]">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-[#151313]">Cours et exercices illimités</h3>
                    <p className="mt-1 text-xs text-gray-600">Accédez à une vaste bibliothèque de cours et d'exercices adaptés à votre niveau.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#fccc42]">
                    <Video className="h-5 w-5 text-[#151313]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-[#151313]">Vidéos éducatives</h3>
                    <p className="mt-1 text-xs text-gray-600">Des vidéos pédagogiques pour mieux comprendre les concepts complexes.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#151313]">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-[#151313]">Planning personnalisé</h3>
                    <p className="mt-1 text-xs text-gray-600">Un planning de révision sur mesure pour optimiser votre temps d'étude.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#f7f7f5] rounded-2xl border border-[#151313]">
                <h3 className="text-sm font-semibold text-[#151313] mb-2">
                  Satisfaction garantie
                </h3>
                <p className="text-xs text-gray-600">
                  Essayez Aizily pendant 30 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-2xl shadow-sm border border-[#151313]">
            <p className="text-[#151313]">
              Besoin d'aide pour choisir ? Contactez-nous au{' '}
              <a href="tel:0422460113" className="text-[#ff5734] font-medium hover:text-[#ff5734]/80">
                04 22 46 01 13
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;