import emailjs from '@emailjs/browser';

interface EmailData {
  category: string;
  subject: string;
  message: string;
  priority: string;
  userEmail: string;
  userName: string;
  attachments?: string[];
}

export const sendFeedbackEmail = async (data: EmailData) => {
  try {
    // Initialize EmailJS
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

    const templateParams = {
      to_email: 'contact.aizily@gmail.com',
      from_name: data.userName,
      from_email: data.userEmail,
      category: data.category,
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      attachments: data.attachments ? data.attachments.join('\n') : 'Aucune pièce jointe'
    };

    console.log('Sending email with params:', {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      params: templateParams
    });

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
