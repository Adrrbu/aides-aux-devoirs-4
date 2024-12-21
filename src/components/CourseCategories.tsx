import React, { useState, useEffect } from 'react';
import { Calculator, BookOpen, TestTube, Globe2, Languages, Search, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CourseSubcategoryView from './CourseSubcategoryView';
import CourseDetails from './CourseDetails';

interface Subject {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  subject_name: string;
  topic_name?: string;
  description?: string;
  content: string;
  document_url?: string;
  created_at: string;
}

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

interface CourseCategoriesProps {
  onAddCourse: () => void;
}

const CourseCategories: React.FC<CourseCategoriesProps> = ({ onAddCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('courses_view')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSelectedCategory(null);
    setSelectedSubfolder(null);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      await loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      course.subject_name === subjects.find(s => s.id === selectedCategory)?.name;
    return matchesSearch && matchesCategory;
  });

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  if (selectedCategory && selectedSubfolder) {
    const categoryName = subjects.find(s => s.id === selectedCategory)?.name || '';
    const categoryCourses = filteredCourses.filter(
      course => course.subject_name === categoryName
    );

    return (
      <>
        <CourseSubcategoryView
          category={categoryName}
          subcategory={selectedSubfolder}
          courses={categoryCourses}
          onBack={handleBack}
          onAddCourse={onAddCourse}
          onCourseSelect={handleCourseSelect}
        />
        {selectedCourse && (
          <CourseDetails
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onDelete={() => {
              handleDeleteCourse(selectedCourse.id);
              setSelectedCourse(null);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Catégories de cours</h2>
        <button
          onClick={onAddCourse}
          className="inline-flex items-center px-6 py-3 border border-[#151313] text-sm font-medium rounded-xl shadow-sm text-white bg-[#ff5734] hover:bg-[#ff5734]/80 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un cours
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
        />
      </div>

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
                      setSelectedCategory(subject.id);
                      setSelectedSubfolder(subject.name);
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
    </div>
  );
};

export default CourseCategories;