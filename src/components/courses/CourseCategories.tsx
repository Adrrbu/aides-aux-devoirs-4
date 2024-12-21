import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CategoryList } from './CategoryList';
import { CourseSubcategoryView } from './CourseSubcategoryView';
import { CourseDetails } from './CourseDetails';
import { SearchBar } from './SearchBar';
import { useCourses } from '../../hooks/useCourses';
import { Course, Subject } from '../../types/course';

interface CourseCategoriesProps {
  onAddCourse: () => void;
}

export const CourseCategories: React.FC<CourseCategoriesProps> = ({ onAddCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { courses, loading, refreshCourses } = useCourses();

  useEffect(() => {
    loadSubjects();
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

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSelectedCategory(null);
    setSelectedSubfolder(null);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      course.subject_name === subjects.find(s => s.id === selectedCategory)?.name;
    return matchesSearch && matchesCategory;
  });

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
            onDelete={refreshCourses}
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
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
        >
          Ajouter un cours
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CategoryList
        subjects={subjects}
        courses={filteredCourses}
        onCategorySelect={(categoryId, subFolder) => {
          setSelectedCategory(categoryId);
          setSelectedSubfolder(subFolder);
        }}
      />
    </div>
  );
};