import React from 'react';
import { User, Trash2 } from 'lucide-react';

interface ChildCardProps {
  child: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, isSelected, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${child.firstName} ${child.lastName} ?`)) {
      onDelete();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center p-4 rounded-xl border transition-colors cursor-pointer ${
        isSelected
          ? 'border-[#ff5734] bg-[#ff5734]/5'
          : 'border-[#151313] hover:border-[#ff5734] bg-white'
      }`}
    >
      <div className="h-16 w-16 rounded-xl overflow-hidden border border-[#151313] flex-shrink-0">
        {child.avatarUrl ? (
          <img
            src={child.avatarUrl}
            alt={`${child.firstName} ${child.lastName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#f7f7f5] flex items-center justify-center">
            <User className="h-8 w-8 text-[#151313]" />
          </div>
        )}
      </div>
      <div className="ml-4 flex-1 text-left">
        <h4 className="text-lg font-medium text-[#151313]">
          {child.firstName} {child.lastName}
        </h4>
      </div>
      <div
        onClick={handleDelete}
        className="p-2 text-gray-400 hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5] cursor-pointer"
      >
        <Trash2 className="h-5 w-5" />
      </div>
    </div>
  );
};

export default ChildCard;