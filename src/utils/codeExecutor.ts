type ConsoleMethod = 'log' | 'info' | 'warn' | 'error';
type ExecutionResult = {
  output: string;
  error: string | null;
};

export const executeCode = (code: string): ExecutionResult => {
  let output = '';
  const result: ExecutionResult = {
    output: '',
    error: null
  };

  // Store original console methods
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  // Override console methods
  const createConsoleMethod = (method: ConsoleMethod) => (...args: any[]) => {
    const formatted = args
      .map(arg => 
        typeof arg === 'object' 
          ? JSON.stringify(arg, null, 2) 
          : String(arg)
      )
      .join(' ');
    output += formatted + '\n';
    
    // Call original method
    switch(method) {
      case 'log':
        originalLog(...args);
        break;
      case 'info':
        originalInfo(...args);
        break;
      case 'warn':
        originalWarn(...args);
        break;
      case 'error':
        originalError(...args);
        break;
    }
  };

  // Override console methods
  console.log = createConsoleMethod('log');
  console.info = createConsoleMethod('info');
  console.warn = createConsoleMethod('warn');
  console.error = createConsoleMethod('error');

  try {
    // Create a function from the code to handle return statements
    const executeFunction = new Function(`
      "use strict";
      try {
        const result = (() => {
          ${code}
        })();
        if (result !== undefined) {
          console.log(result);
        }
      } catch (e) {
        throw e;
      }
    `);

    executeFunction();
    result.output = output;
  } catch (error: any) {
    result.error = error.toString();
  } finally {
    // Restore original console methods
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }

  return result;
};