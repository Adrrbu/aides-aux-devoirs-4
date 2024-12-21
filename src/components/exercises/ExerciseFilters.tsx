import React from 'react';
import { Search } from 'lucide-react';
import { EDUCATION_LEVELS } from '../../lib/constants/educationLevels';
import { SUBJECTS } from '../../lib/constants/subjects';

interface ExerciseFiltersProps {
  filterSubject: string;
  filterLevel: string;
  onFilterChange: (subject: string, level: string) => void;
}

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  filterSubject,
  filterLevel,
  onFilterChange
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#151313]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Filtrer par matière
          </label>
          <select
            value={filterSubject}
            onChange={(e) => onFilterChange(e.target.value, filterLevel)}
            className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
          >
            <option value="">Toutes les matières</option>
            {SUBJECTS.map(subject => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Filtrer par niveau
          </label>
          <select
            value={filterLevel}
            onChange={(e) => onFilterChange(filterSubject, e.target.value)}
            className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
          >
            <option value="">Tous les niveaux</option>
            <optgroup label="Collège">
              {EDUCATION_LEVELS.college.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Lycée">
              {EDUCATION_LEVELS.lycee.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFilters;