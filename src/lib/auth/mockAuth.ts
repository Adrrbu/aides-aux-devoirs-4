// Mock data for development environment
export const mockAuth = {
  user: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'dev@example.com',
    first_name: 'Dev',
    last_name: 'User',
    role: 'student',
    has_completed_onboarding: false,
    avatar_url: null,
    preferences: {
      theme: 'light',
      notifications: {
        email: false,
        push: false
      },
      calendar: {
        defaultView: 'week',
        startHour: 8,
        endHour: 18
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};