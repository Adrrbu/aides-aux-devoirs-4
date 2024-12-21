import React from 'react';
import { Calculator, BookOpen, TestTube, Globe2, Languages } from 'lucide-react';
import { Subject, Course } from '../../types/course';

const SUBJECT_ICONS: Record<string, {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}> = {
  'Mathématiques': {
    icon: Calculator,
    bgColor: '#ff5734',
    iconColor: '#ffffff'
  },
  'Français': {
    icon: BookOpen,
    bgColor: '#be94f5',
    iconColor: '#ffffff'
  },
  'Histoire-Géographie': {
    icon: Globe2,
    bgColor: '#fccc42',
    iconColor: '#151313'
  },
  'Sciences': {
    icon: TestTube,
    bgColor: '#151313',
    iconColor: '#ffffff'
  },
  'Anglais': {
    icon: Languages,
    bgColor: '#ff5734',
    iconColor: '#ffffff'
  }
};

interface CategoryListProps {
  subjects: Subject[];
  courses: Course[];
  onCategorySelect: (categoryId: string, subFolder: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  subjects,
  courses,
  onCategorySelect,
}) => {
  const cardClasses = "bg-white rounded-2xl shadow-sm border border-[#151313]";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => {
        const subjectCourses = courses.filter(
          course => course.subject_name === subject.name
        );
        const Icon = SUBJECT_ICONS[subject.name]?.icon || BookOpen;
        const bgColor = SUBJECT_ICONS[subject.name]?.bgColor || '#151313';
        const iconColor = SUBJECT_ICONS[subject.name]?.iconColor || '#ffffff';

        return (
          <div key={subject.id} className={cardClasses}>
            <div className="p-6">
              <div className="flex items-center">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="h-6 w-6" style={{ color: iconColor }} />
                </div>
                <h3 className="ml-4 text-lg font-medium text-[#151313]">
                  {subject.name}
                </h3>
              </div>
              <div className="mt-4">
                <div
                  onClick={() => {
                    onCategorySelect(subject.id, subject.name);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f7f7f5] cursor-pointer border border-[#151313] transition-colors"
                >
                  <span className="text-sm text-[#151313]">Tous les cours</span>
                  <span className="text-xs text-[#151313]/60">
                    {subjectCourses.length} cours
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};