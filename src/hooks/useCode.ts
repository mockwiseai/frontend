import { useSelector, useDispatch } from 'react-redux';
import { setCode, setOutput, setError, setIsRunning } from '@/store/codeSlice';
import api from '@/services/api';

export function useCode() {
  const dispatch = useDispatch();
  const { code, output, isRunning, error } = useSelector((state: any) => state.code);

  const runCode = async () => {
    try {
      dispatch(setIsRunning(true));
      dispatch(setError(null));
      
      const { data } = await api.post('/compiler/run', { code });
      dispatch(setOutput(data.output));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to run code'));
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  return {
    code,
    output,
    isRunning,
    error,
    setCode: (code: string) => dispatch(setCode(code)),
    runCode,
  };
}