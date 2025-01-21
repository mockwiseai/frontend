import { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useCode } from '@/hooks/useCode';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
}

export default function CodeEditor({ initialCode = '', language = 'javascript' }: CodeEditorProps) {
  const { code, setCode, isRunning } = useCode();

  useEffect(() => {
    if (initialCode && !code) {
      setCode(initialCode);
    }
  }, [initialCode, code, setCode]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly: isRunning,
        }}
      />
    </div>
  );
}