import React, { useState, useEffect } from 'react';
import { RotateCw, Download, Clock, Brain } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TestResultsProps {
  results: string;
  onReset: () => void;
  testType: 'personality' | 'aptitude' | 'interests';
}

const TestResults: React.FC<TestResultsProps> = ({ results, onReset, testType }) => {
  const [previousResults, setPreviousResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreviousResults();
  }, [testType]);

  const loadPreviousResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('career_test_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('test_type', testType)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPreviousResults(data || []);
    } catch (error) {
      console.error('Error loading previous results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([results], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats-${testType}-${format(new Date(), 'dd-MM-yyyy')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Résultats actuels */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
        <h2 className="text-xl font-bold text-[#151313] mb-6">Résultats de l'analyse</h2>
        
        <div 
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: results }}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReset}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-[#151313] rounded-xl text-[#151313] bg-white hover:bg-[#f7f7f5]"
          >
            <RotateCw className="h-5 w-5 mr-2" />
            Refaire un test
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-[#151313] rounded-xl text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
          >
            <Download className="h-5 w-5 mr-2" />
            Télécharger les résultats
          </button>
        </div>
      </div>

      {/* Historique des résultats */}
      {previousResults.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
          <h3 className="text-lg font-medium text-[#151313] mb-4">
            Historique des tests
          </h3>
          <div className="space-y-4">
            {previousResults.map((result) => (
              <div
                key={result.id}
                className="p-4 rounded-xl bg-[#f7f7f5] border border-[#151313]/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-[#ff5734] mr-2" />
                    <h4 className="font-medium text-[#151313]">
                      Test {result.test_type}
                    </h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(result.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result.analysis }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;