import { GiftCardData } from '../../../types/store';

export const GIFT_CARDS: GiftCardData[] = [
  // Gaming
  {
    id: 'fortnite',
    name: 'V-Bucks Fortnite',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/Fortnite_blog_v-bucks-cards-coming-to-retailers-soon_BlogHeader-1920x1080-0a5880b705b1c2e13becf940508f24791e5d90b8.jpg',
    description: 'Pour acheter des skins et des objets dans Fortnite',
    values: [10, 20, 30, 50],
    category: 'gaming'
  },
  {
    id: 'playstation',
    name: 'PlayStation Store',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/rk4tli0w88ow48ccswggw.webp',
    description: 'Pour acheter des jeux et du contenu sur le PS Store',
    values: [10, 20, 50],
    category: 'gaming'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/3d47453e-0b88-400f-a2b1-0035136c8f3e.webp',
    description: 'Pour les achats in-game Minecraft',
    values: [10, 20, 30],
    category: 'gaming'
  },
  {
    id: 'nintendo',
    name: 'Nintendo eShop',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/H2x1_NintendoeShop_GiftCards_Euro.jpg',
    description: 'Pour acheter des jeux sur le Nintendo eShop',
    values: [15, 25, 50],
    category: 'gaming'
  },
  {
    id: 'steam',
    name: 'Steam',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/steam-gift-card-logo.webp',
    description: 'Pour acheter des jeux sur Steam',
    values: [10, 20, 50, 100],
    category: 'gaming'
  },
  {
    id: 'xbox',
    name: 'Xbox',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=60',
    description: 'Pour acheter des jeux et du contenu Xbox',
    values: [10, 25, 50],
    category: 'gaming'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: 'https://images.unsplash.com/photo-1592564630984-7410f94db184?w=800&auto=format&fit=crop&q=60',
    description: 'Pour acheter des Robux et des objets in-game',
    values: [10, 25, 40],
    category: 'gaming'
  },
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    description: 'Pour acheter des RP et des skins',
    values: [10, 25, 50],
    category: 'gaming'
  },

  // Entertainment
  {
    id: 'spotify',
    name: 'Spotify',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/spotify-4x3.png',
    description: 'Pour profiter de Spotify Premium',
    values: [10, 30, 60],
    category: 'entertainment'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/carte-netflix.jpg?t=2024-12-07T16%3A29%3A50.523Z',
    description: 'Pour regarder vos séries et films préférés',
    values: [15, 25, 50],
    category: 'entertainment'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/disney-plus-carte-cadeau.jpg?t=2024-12-07T16%3A30%3A58.839Z',
    description: 'Pour accéder aux contenus Disney, Marvel, Star Wars et plus',
    values: [15, 30, 60],
    category: 'entertainment'
  },
  {
    id: 'prime-video',
    name: 'Prime Video',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/163922092_m_normal_none-scaled.jpg',
    description: 'Pour regarder les films et séries Amazon Prime',
    values: [10, 25, 50],
    category: 'entertainment'
  },
  {
    id: 'apple',
    name: 'App Store & iTunes',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/apple-gift-cards-landing-holiday-202411_GEO_FR.jpeg',
    description: 'Pour les achats sur l\'App Store, iTunes et Apple Music',
    values: [15, 25, 50],
    category: 'entertainment'
  },
  {
    id: 'google-play',
    name: 'Google Play',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/play-card_coupons.webp',
    description: 'Pour les applications, jeux et contenus Android',
    values: [10, 25, 50],
    category: 'entertainment'
  },
  {
    id: 'deezer',
    name: 'Deezer',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/deezer-logo-coeur.jpg?t=2024-12-07T16%3A37%3A06.293Z',
    description: 'Pour écouter votre musique préférée',
    values: [10, 20, 50],
    category: 'entertainment'
  },
  {
    id: 'canal-plus',
    name: 'Canal+',
    image: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=800&auto=format&fit=crop&q=60',
    description: 'Pour regarder vos programmes Canal+',
    values: [20, 40, 80],
    category: 'entertainment'
  },

  // Shopping
  {
    id: 'fnac',
    name: 'Carte FNAC',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/CARTE-CADEAU-50CHF.jpg',
    description: 'Valable sur tout le site fnac.com et en magasin',
    values: [10, 20, 30, 50],
    category: 'shopping'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/amazon_interior.png',
    description: 'Pour acheter sur Amazon',
    values: [10, 25, 50],
    category: 'shopping'
  },
  {
    id: 'darty',
    name: 'Darty',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/carte-cadeau-fnac-darty-portail-service.png',
    description: 'Pour l\'électroménager et le high-tech',
    values: [30, 50, 100],
    category: 'shopping'
  },
  {
    id: 'boulanger',
    name: 'Boulanger',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/logo-boulanger.webp',
    description: 'Pour l\'électroménager et le multimédia',
    values: [30, 50, 100],
    category: 'shopping'
  },
  {
    id: 'cultura',
    name: 'Cultura',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/image_processing20221212-77351-5y7xpr.jpg',
    description: 'Pour les livres, la musique et les loisirs créatifs',
    values: [20, 30, 50],
    category: 'shopping'
  },
  {
    id: 'micromania',
    name: 'Micromania',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/41614.webp',
    description: 'Pour les jeux vidéo et consoles',
    values: [20, 30, 50],
    category: 'shopping'
  },
  {
    id: 'zalando',
    name: 'Zalando',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/zalando-1709167530.webp?t=2024-12-07T16%3A43%3A24.164Z',
    description: 'Pour la mode et les accessoires',
    values: [20, 50, 100],
    category: 'shopping'
  },
  {
    id: 'sephora',
    name: 'Sephora',
    image: 'https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/partner-images/s-l1200.jpg',
    description: 'Pour les produits de beauté',
    values: [20, 50, 100],
    category: 'shopping'
  }
];