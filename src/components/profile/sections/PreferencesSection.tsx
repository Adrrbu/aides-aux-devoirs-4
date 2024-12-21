import React from 'react';
import { Bell, Calendar, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeProvider';

interface PreferencesSectionProps {
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    calendar: {
      defaultView: 'week' | 'month';
      startHour: number;
      endHour: number;
    };
  };
  onUpdate: (newPreferences: any) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  preferences,
  onUpdate
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Theme toggle clicked. Current theme:', theme);
    await toggleTheme();
    console.log('Theme toggled to:', theme === 'light' ? 'dark' : 'light');
  };

  const handleNotificationToggle = (type: 'email' | 'push') => {
    onUpdate({
      notifications: {
        ...preferences.notifications,
        [type]: !preferences.notifications[type]
      }
    });
  };

  const handleCalendarViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      calendar: {
        ...preferences.calendar,
        defaultView: e.target.value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Thème */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Apparence</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
            ) : (
              <Moon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Thème</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'light' ? 'Clair' : 'Sombre'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleThemeToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={theme === 'dark'}
          >
            <span className="sr-only">
              {theme === 'light' ? 'Activer' : 'Désactiver'} le mode sombre
            </span>
            <span
              aria-hidden="true"
              className={`${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 transition-colors duration-200">
        <div className="flex items-center mb-6">
          <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les notifications par email</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('email')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                preferences.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={preferences.notifications.email}
            >
              <span className="sr-only">Activer les notifications par email</span>
              <span
                aria-hidden="true"
                className={`${
                  preferences.notifications.email ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Notifications push</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les notifications sur le navigateur</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('push')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                preferences.notifications.push ? 'bg-primary-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={preferences.notifications.push}
            >
              <span className="sr-only">Activer les notifications push</span>
              <span
                aria-hidden="true"
                className={`${
                  preferences.notifications.push ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 transition-colors duration-200">
        <div className="flex items-center mb-6">
          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calendrier</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="defaultView" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Vue par défaut
            </label>
            <select
              id="defaultView"
              value={preferences.calendar.defaultView}
              onChange={handleCalendarViewChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;