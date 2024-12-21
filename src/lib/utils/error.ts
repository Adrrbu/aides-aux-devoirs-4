export const handleSupabaseError = (error: any): string => {
  console.error('Supabase Error Details:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    status: error.status,
    stack: error.stack
  });
  
  switch (error.code) {
    case 'PGRST116':
      return 'Aucune donnée trouvée';
    case '42703':
      return 'Erreur de schéma de base de données';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case '23505':
      return 'Un compte existe déjà avec cet email';
    case '22P02':
      return 'Format de données invalide';
    case 'PGRST204':
      return 'Erreur de configuration de la base de données';
    case '42501':
      return 'Erreur de permissions. Veuillez vous reconnecter.';
    case '23503':
      return 'Erreur de référence. Veuillez réessayer.';
    case 'unexpected_failure':
      return 'Une erreur inattendue est survenue. Veuillez réessayer.';
    default:
      if (error.message?.includes('duplicate key')) {
        return 'Un compte existe déjà avec cet email';
      }
      if (error.message?.includes('password')) {
        return 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (error.message?.includes('email')) {
        return 'Email invalide';
      }
      if (error.message?.includes('row-level security')) {
        return 'Erreur de permissions. Veuillez vous reconnecter.';
      }
      return error.message || 'Une erreur inattendue est survenue';
  }
};