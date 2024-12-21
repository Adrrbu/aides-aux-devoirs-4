import React from 'react';
import { Search } from 'lucide-react';
import { SUBJECTS } from '../../lib/constants/subjects';

interface SearchBarProps {
  searchTerm: string;
  selectedSubject: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  selectedSubject,
  loading,
  onSearchChange,
  onSubjectChange,
  onSearch
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une vidéo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="pl-10 w-full h-12 rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
        />
      </div>
      <select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="h-12 rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
      >
        <option value="all">Toutes les matières</option>
        {SUBJECTS.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
      <button
        onClick={onSearch}
        disabled={loading}
        className="h-12 px-6 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/80 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Recherche...' : 'Rechercher'}
      </button>
    </div>
  );
};

export default SearchBar;