import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/ext-beautify"
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";

// import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
// import "ace-builds/src-noconflict/theme-terminal";
// import "ace-builds/src-noconflict/theme-twilight";
// import "ace-builds/src-noconflict/theme-xcode";

// Render editor
interface AceCodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}
function AceCodeEditor({ language, value, onChange }: AceCodeEditorProps) {
  return (
    <AceEditor
      className="min-w-full h-full bg-gray-900"
      height="60vh"
      mode={language}
      // onr
      theme="solarized_dark"
      onChange={onChange}
      name="code-editor"
      value={value}
      editorProps={{ $blockScrolling: true, $useWorker: false }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        fontSize: 14,
        showLineNumbers: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: false,
        padding: { top: 20 }
      }}
    />
  );
}

export default AceCodeEditor;