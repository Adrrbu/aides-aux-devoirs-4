export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Email invalide',
  WEAK_PASSWORD: 'Le mot de passe doit contenir au moins 6 caractères',
  EMAIL_IN_USE: 'Cet email est déjà utilisé',
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  NETWORK_ERROR: 'Erreur de connexion, veuillez réessayer',
  UNEXPECTED: 'Une erreur inattendue est survenue',
  DATABASE_ERROR: 'Erreur lors de la sauvegarde des données',
  INITIALIZATION_ERROR: 'Erreur lors de l\'initialisation du compte',
  TIMEOUT: 'La requête a pris trop de temps, veuillez réessayer'
} as const;

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return AUTH_ERRORS.UNEXPECTED;

  // Handle Supabase auth errors
  if (error.__isAuthError) {
    switch (error.status) {
      case 400:
        if (error.message.includes('password')) return AUTH_ERRORS.WEAK_PASSWORD;
        if (error.message.includes('email')) return AUTH_ERRORS.INVALID_EMAIL;
        return error.message;
      case 401:
        return AUTH_ERRORS.INVALID_CREDENTIALS;
      case 404:
        return AUTH_ERRORS.USER_NOT_FOUND;
      case 409:
        return AUTH_ERRORS.EMAIL_IN_USE;
      case 500:
        return AUTH_ERRORS.DATABASE_ERROR;
      case 503:
        return AUTH_ERRORS.TIMEOUT;
      default:
        if (error.code === 'unexpected_failure') {
          return AUTH_ERRORS.INITIALIZATION_ERROR;
        }
        return error.message || AUTH_ERRORS.UNEXPECTED;
    }
  }

  // Handle network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return AUTH_ERRORS.NETWORK_ERROR;
  }

  // Handle database errors
  if (error.code?.startsWith('23') || error.code?.startsWith('42')) {
    return AUTH_ERRORS.DATABASE_ERROR;
  }

  // Handle timeout errors
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    return AUTH_ERRORS.TIMEOUT;
  }

  return error.message || AUTH_ERRORS.UNEXPECTED;
};