export const formatMathContent = (content: string): string => {
  console.log('Formatting math content. Input:', content);

  try {
    let formattedContent = content;

    // Log chaque étape de transformation
    const logTransformation = (step: string, result: string) => {
      console.log(`Math formatting - ${step}:`, result);
    };

    // Traitement des équations entre crochets simples
    formattedContent = formattedContent.replace(/\[([^\]]+)\]/g, '<div class="math-block">$1</div>');
    logTransformation('Brackets', formattedContent);

    // Exposants
    formattedContent = formattedContent
      .replace(/(\w+)²/g, '<span class="math-inline">$1<sup>2</sup></span>')
      .replace(/(\w+)³/g, '<span class="math-inline">$1<sup>3</sup></span>')
      .replace(/\^({[^}]+}|\d+)/g, (_, p1) => `<sup>${p1.replace(/[{}]/g, '')}</sup>`);
    logTransformation('Exponents', formattedContent);

    // Variables mathématiques
    formattedContent = formattedContent.replace(/\\([a-zA-Z])/g, '<span class="math-var">$1</span>');
    logTransformation('Variables', formattedContent);

    // Racines carrées
    formattedContent = formattedContent.replace(
      /\\sqrt\{([^}]+)\}/g,
      '<span class="math-sqrt"><span class="math-sqrt-symbol">√</span><span class="math-sqrt-content">$1</span></span>'
    );
    logTransformation('Square roots', formattedContent);

    // Fractions
    formattedContent = formattedContent.replace(
      /\\frac\{([^}]+)\}\{([^}]+)\}/g,
      '<span class="math-frac"><span class="math-num">$1</span><span class="math-denom">$2</span></span>'
    );
    logTransformation('Fractions', formattedContent);

    // Symboles mathématiques
    const symbols = {
      '\\pi': 'π',
      '\\theta': 'θ',
      '\\alpha': 'α',
      '\\beta': 'β',
      '\\sum': '∑',
      '\\infty': '∞',
      '\\times': '×',
      '\\div': '÷',
      '\\pm': '±'
    };

    Object.entries(symbols).forEach(([symbol, replacement]) => {
      formattedContent = formattedContent.replace(new RegExp(symbol, 'g'), replacement);
    });
    logTransformation('Symbols', formattedContent);

    // Opérateurs et espacement
    formattedContent = formattedContent
      .replace(/=/g, ' = ')
      .replace(/\+/g, ' + ')
      .replace(/(?<!^)\s*-\s*/g, ' - ');
    logTransformation('Operators', formattedContent);

    // Parenthèses et délimiteurs
    const delimiters = {
      '\\left\\(': '(',
      '\\right\\)': ')',
      '\\left\\[': '[',
      '\\right\\]': ']',
      '\\left\\{': '{',
      '\\right\\}': '}'
    };

    Object.entries(delimiters).forEach(([delimiter, replacement]) => {
      formattedContent = formattedContent.replace(new RegExp(delimiter, 'g'), replacement);
    });
    logTransformation('Delimiters', formattedContent);

    console.log('Final math formatted content:', formattedContent);
    return formattedContent.trim();
  } catch (error) {
    console.error('Error in formatMathContent:', error);
    throw error;
  }
};