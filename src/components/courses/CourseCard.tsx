import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Course } from '../../types/course';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div
      onClick={onClick}
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
  );
};