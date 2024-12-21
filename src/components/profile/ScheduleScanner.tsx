import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ScheduleScan {
  id: string;
  file_url: string;
  processed_status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_data: any;
  created_at: string;
}

interface ScheduleScannerProps {
  userId: string;
}

const ScheduleScanner: React.FC<ScheduleScannerProps> = ({ userId }) => {
  const [scans, setScans] = useState<ScheduleScan[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error loading scans:', error);
      toast.error('Erreur lors du chargement des scans');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('schedule-scans')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('schedule-scans')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('schedule_scans')
        .insert([{
          user_id: userId,
          file_url: publicUrl,
          processed_status: 'pending'
        }]);

      if (insertError) throw insertError;

      toast.success('Emploi du temps téléchargé avec succès');
      loadScans();
    } catch (error) {
      console.error('Error uploading schedule:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500" />
        );
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone de téléchargement */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="max-w-xl">
          <label className="block text-sm font-medium text-gray-700">
            Scanner un emploi du temps
          </label>
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
        </div>
      </div>

      {/* Liste des scans */}
      {scans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Emplois du temps scannés
          </h3>
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(scan.processed_status)}
                  </div>
                  <div>
                    <a
                      href={scan.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      Voir le document
                    </a>
                    <p className="text-sm text-gray-500">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {scan.processed_status === 'completed' && 'Traité'}
                  {scan.processed_status === 'failed' && 'Échec'}
                  {scan.processed_status === 'pending' && 'En attente'}
                  {scan.processed_status === 'processing' && 'En cours'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleScanner;