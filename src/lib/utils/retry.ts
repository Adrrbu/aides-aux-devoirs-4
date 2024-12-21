interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

export const retry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = DEFAULT_OPTIONS.maxAttempts,
  initialDelay = DEFAULT_OPTIONS.initialDelay,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const opts = { ...DEFAULT_OPTIONS, ...options, maxAttempts, initialDelay };
  let lastError: Error;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === opts.maxAttempts) {
        throw error;
      }

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelay);
    }
  }

  throw lastError!;
};