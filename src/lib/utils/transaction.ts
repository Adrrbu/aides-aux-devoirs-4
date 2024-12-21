import { SupabaseClient } from '@supabase/supabase-js';
import { retry, RetryOptions } from './retry';

export interface TransactionOptions extends RetryOptions {
  isolationLevel?: 'ReadCommitted' | 'Serializable';
}

export async function withTransaction<T>(
  supabase: SupabaseClient,
  operations: () => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  return retry(async () => {
    const { error: beginError } = await supabase.rpc('begin_transaction', {
      isolation_level: options.isolationLevel || 'ReadCommitted'
    });

    if (beginError) throw beginError;

    try {
      const result = await operations();
      
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;

      return result;
    } catch (error) {
      await supabase.rpc('rollback_transaction').catch(console.error);
      throw error;
    }
  }, options);
}