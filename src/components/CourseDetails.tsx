import React, { useState } from 'react';
import { X, Printer, Calendar, FileText, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CourseDetailsProps {
  course: {
    id: string;
    title: string;
    subject: {
      name: string;
    };
    content: string;
    created_at: string;
    document_url?: string;
  };
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ 
  course, 
  onClose,
  onDelete,
  onEdit
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${course.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
                background-color: #f7f7f5;
              }
              h1 { 
                color: #151313;
                font-size: 24px;
                margin-bottom: 16px;
              }
              .metadata {
                color: #6B7280;
                font-size: 14px;
                margin-bottom: 24px;
              }
              .content {
                line-height: 1.6;
                background-color: white;
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #151313;
              }
            </style>
          </head>
          <body>
            <h1>${course.title}</h1>
            <div class="metadata">
              <div>Matière: ${course.subject.name}</div>
              <div>Date: ${format(new Date(course.created_at), 'dd MMMM yyyy', { locale: fr })}</div>
            </div>
            <div class="content">${course.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('exam_content')
        .delete()
        .eq('id', course.id);

      if (error) throw error;

      toast.success('Cours supprimé avec succès');
      onDelete?.();
      onClose();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erreur lors de la suppression du cours');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#151313]">
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#151313]">{course.title}</h2>
            <div className="mt-1 flex items-center text-sm text-[#151313]/80">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(course.created_at), 'dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {course.document_url && (
              <a
                href={course.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
                title="Voir le document"
              >
                <FileText className="h-5 w-5" />
              </a>
            )}
            <button
              onClick={handlePrint}
              className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
              title="Imprimer"
            >
              <Printer className="h-5 w-5" />
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-[#f7f7f5]" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
          <div 
            className="prose max-w-none bg-white p-6 rounded-2xl border border-[#151313]"
            dangerouslySetInnerHTML={{ __html: course.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;