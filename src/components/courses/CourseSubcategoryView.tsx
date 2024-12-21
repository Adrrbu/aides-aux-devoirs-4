import React from 'react';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { EmptyState } from '../ui/EmptyState';
import { Course } from '../../types/course';

interface CourseSubcategoryViewProps {
  category: string;
  subcategory: string;
  courses: Course[];
  onBack: () => void;
  onAddCourse: () => void;
  onCourseSelect: (course: Course) => void;
}

export const CourseSubcategoryView: React.FC<CourseSubcategoryViewProps> = ({
  category,
  courses,
  onBack,
  onAddCourse,
  onCourseSelect
}) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      <div className={`${cardClasses} flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#f7f7f5] rounded-xl transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#151313]" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#151313]">{category}</h2>
            <p className="text-sm text-gray-500">Tous les cours disponibles</p>
          </div>
        </div>
        <button
          onClick={onAddCourse}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un cours
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => onCourseSelect(course)}
            />
          ))
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Aucun cours"
            description="Commencez par ajouter votre premier cours dans cette catégorie."
            action={{
              label: "Ajouter un cours",
              onClick: onAddCourse
            }}
          />
        )}
      </div>
    </div>
  );
};