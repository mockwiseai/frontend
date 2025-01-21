import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CodeState } from '@/types';

const initialState: CodeState = {
  code: '',
  language: 'javascript',
  output: '',
  isRunning: false,
  error: null,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCode, setLanguage, setOutput, setIsRunning, setError } = codeSlice.actions;
export default codeSlice.reducer;