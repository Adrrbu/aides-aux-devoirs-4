import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CourseDetails from './CourseDetails';

interface Course {
  id: string;
  title: string;
  subject: {
    name: string;
  };
  topic: {
    name: string;
  };
  content: string;
  created_at: string;
}

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    loadSubjects();
    loadCourses();
  }, []);

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSubjects([{ id: 'all', name: 'Toutes les matières' }, ...(data || [])]);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: examContent, error } = await supabase
        .from('exam_content')
        .select(`
          id,
          course_content,
          exam:exam_id (
            id,
            title,
            created_at,
            subject:subject_id (
              name
            ),
            topic:topic_id (
              name
            )
          )
        `)
        .not('course_content', 'is', null);

      if (error) throw error;

      const formattedCourses = examContent
        ?.filter(content => content.course_content && content.exam)
        .map(content => ({
          id: content.id,
          title: content.exam.title,
          subject: content.exam.subject,
          topic: content.exam.topic,
          content: content.course_content,
          created_at: content.exam.created_at
        }));

      setCourses(formattedCourses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    (selectedSubject === 'all' || course.subject?.name === subjects.find(s => s.id === selectedSubject)?.name) &&
    (searchTerm === '' || course.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Cours disponibles</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
        >
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardClasses} animate-pulse`}>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex gap-2 mb-4">
                {[1, 2].map((j) => (
                  <div key={j} className="h-6 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
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
              <div className="mt-4 flex flex-wrap gap-2">
                {course.subject && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#be94f5] text-white">
                    {course.subject.name}
                  </span>
                )}
                {course.topic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fccc42] text-[#151313]">
                    {course.topic.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${cardClasses} text-center py-12`}>
          <BookOpen className="mx-auto h-12 w-12 text-[#ff5734]" />
          <h3 className="mt-2 text-sm font-medium text-[#151313]">Aucun cours</h3>
          <p className="mt-1 text-sm text-gray-500">
            Les cours générés apparaîtront ici.
          </p>
        </div>
      )}

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default Courses;