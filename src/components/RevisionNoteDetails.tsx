import React from 'react';
import { X, Printer, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RevisionNoteDetailsProps {
  note: {
    title: string;
    subject: string;
    content: string;
    tags: string[];
    created_at: string;
  };
  onClose: () => void;
}

const RevisionNoteDetails: React.FC<RevisionNoteDetailsProps> = ({ note, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${note.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 { 
                color: #4F46E5;
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
              }
            </style>
          </head>
          <body>
            <h1>${note.title}</h1>
            <div class="metadata">
              <div>Matière: ${note.subject}</div>
              <div>Date: ${format(new Date(note.created_at), 'dd MMMM yyyy', { locale: fr })}</div>
            </div>
            <div class="content">${note.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(note.created_at), 'dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
          <div className="mb-4 flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default RevisionNoteDetails;