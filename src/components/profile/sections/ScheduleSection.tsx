import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, X, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ScheduleScan {
  id: string;
  file_path: string;
  processed_status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_data: any;
  created_at: string;
}

interface ScheduleSectionProps {
  userId: string;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ userId }) => {
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleScan | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentSchedule();
  }, []);

  useEffect(() => {
    if (currentSchedule?.file_path) {
      const { data } = supabase.storage
        .from('schedule-scans')
        .getPublicUrl(currentSchedule.file_path);
      
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
      }
    } else {
      setImageUrl(null);
    }
  }, [currentSchedule]);

  const loadCurrentSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCurrentSchedule(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast.error('Erreur lors du chargement de l\'emploi du temps');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      // Delete previous schedule if exists
      if (currentSchedule) {
        await supabase.storage
          .from('schedule-scans')
          .remove([currentSchedule.file_path]);

        await supabase
          .from('schedule_scans')
          .delete()
          .eq('id', currentSchedule.id);
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('schedule-scans')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error: insertError } = await supabase
        .from('schedule_scans')
        .insert([{
          user_id: userId,
          file_path: filePath,
          processed_status: 'completed'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentSchedule(data);
      toast.success('Emploi du temps mis à jour avec succès');
    } catch (error) {
      console.error('Error uploading schedule:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentSchedule) return;

    try {
      await supabase.storage
        .from('schedule-scans')
        .remove([currentSchedule.file_path]);

      await supabase
        .from('schedule_scans')
        .delete()
        .eq('id', currentSchedule.id);

      setCurrentSchedule(null);
      setImageUrl(null);
      toast.success('Emploi du temps supprimé');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Emploi du temps
            </h3>
            {currentSchedule && (
              <p className="mt-1 text-sm text-gray-500">
                Mis à jour le {new Date(currentSchedule.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              {currentSchedule ? 'Remplacer' : 'Ajouter'}
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            {currentSchedule && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            )}
          </div>
        </div>

        {currentSchedule && imageUrl ? (
          <div className="relative">
            <div className="w-full h-[600px] overflow-hidden rounded-lg border border-gray-200">
              <img
                src={imageUrl}
                alt="Emploi du temps"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <a 
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Télécharger un fichier</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG ou PDF jusqu'à 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSection;