// src/services/feedback.ts
import { supabase } from '../lib/supabase';
import { sendFeedbackEmail } from './email';
import { handleSupabaseError } from '../lib/utils/error';
import toast from 'react-hot-toast';

export interface FeedbackData {
  category: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: File[];
}

export const submitFeedback = async (data: FeedbackData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Récupérer les informations de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Upload des pièces jointes si présentes
    const attachmentUrls: string[] = [];
    if (data.attachments?.length) {
      for (const file of data.attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `feedback-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('feedback-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('feedback-attachments')
          .getPublicUrl(filePath);

        attachmentUrls.push(publicUrl);
      }
    }

    // Créer l'entrée de feedback
    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert([{
        user_id: user.id,
        category: data.category,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
        attachment_urls: attachmentUrls,
        status: 'pending'
      }]);

    if (feedbackError) throw feedbackError;

    // Envoyer l'email
    await sendFeedbackEmail({
      category: data.category,
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      userEmail: profile.email,
      userName: `${profile.first_name} ${profile.last_name}`,
      attachments: attachmentUrls
    });

    toast.success('Merci pour votre retour !');
    return true;
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    const message = handleSupabaseError(error);
    toast.error(message);
    throw error;
  }
};
