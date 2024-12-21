import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../../../hooks/useChildren';

const ChildrenOverview: React.FC = () => {
  const { children, loading } = useChildren();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#151313] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-xl bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#151313]">
      <h3 className="text-lg font-medium text-[#151313] mb-4">Mes enfants</h3>
      
      <div className="space-y-4">
        {children.map((child) => (
          <div
            key={child.child_id}
            className="flex items-center justify-between p-4 rounded-xl border border-[#151313] hover:border-[#ff5734] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden border border-[#151313]">
                {child.child_avatar_url ? (
                  <img
                    src={child.child_avatar_url}
                    alt={`${child.child_first_name} ${child.child_last_name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#f7f7f5] flex items-center justify-center">
                    <User className="h-8 w-8 text-[#151313]" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-[#151313]">
                  {child.child_first_name} {child.child_last_name}
                </h4>
                <p className="text-sm text-gray-500">Voir le profil</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#ff5734]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildrenOverview;