import { formatMathContent } from './mathFormatter';

export const formatCourseContent = (content: string): string => {
  console.log('Formatting course content. Input:', content);

  try {
    let formattedContent = formatMathContent(content);
    console.log('After math formatting:', formattedContent);
    
    formattedContent = formattedContent
      .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/\n\n/g, '</p><p class="text-gray-700 mb-3">')
      .replace(/^- (.*)/gm, '<li class="text-gray-700 ml-4">$1</li>')
      .replace(/<li/g, '<ul class="list-disc mb-3"><li')
      .replace(/li>\n/g, 'li></ul>\n')
      .replace(/^###\s+/gm, '')
      .replace(/^##\s+/gm, '')
      .replace(/^#\s+/gm, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>');

    console.log('Final formatted content:', formattedContent);
    return formattedContent.trim();
  } catch (error) {
    console.error('Error in formatCourseContent:', error);
    throw error;
  }
};