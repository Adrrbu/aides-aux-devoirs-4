import React from 'react';
import { ArrowLeft, Plus, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ... (interfaces restent identiques)

const CourseSubcategoryView: React.FC<CourseSubcategoryViewProps> = ({
  category,
  subcategory,
  courses,
  onBack,
  onAddCourse,
  onCourseSelect
}) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  const handleCourseClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation(); // Empêcher la propagation de l'événement
    onCourseSelect(course);
  };

  return (
    <div className="space-y-6">
      <div className={`${cardClasses} flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
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
          onClick={(e) => {
            e.stopPropagation();
            onAddCourse();
          }}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un cours
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div
              key={course.id}
              onClick={(e) => handleCourseClick(e, course)}
              className={`${cardClasses} hover:border-[#ff5734] transition-colors cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#151313]">{course.title}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(course.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                <BookOpen className="h-6 w-6 text-[#ff5734]" />
              </div>

              {course.topic_name && (
                <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#be94f5] text-white">
                  {course.topic_name}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={`${cardClasses} col-span-3 text-center py-12`}>
            <BookOpen className="mx-auto h-12 w-12 text-[#ff5734]" />
            <h3 className="mt-2 text-sm font-medium text-[#151313]">Aucun cours</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre premier cours dans cette catégorie.
            </p>
            <div className="mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCourse();
                }}
                className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un cours
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSubcategoryView;