import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className={`${cardClasses} col-span-3 text-center py-12`}>
      <Icon className="mx-auto h-12 w-12 text-[#ff5734]" />
      <h3 className="mt-2 text-sm font-medium text-[#151313]">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};