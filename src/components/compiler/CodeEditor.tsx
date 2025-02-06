"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader } from "lucide-react";
import Output from "./Output";
import axios from "axios";
import Link from "next/link";
import AceCodeEditor from "./AceEditor";

type SupportedLanguage = "python" | "javascript" | "java" | "cpp" | "go" | 'cs' | 'c';

const languageMapping = {
  python: 'py',
  javascript: "js",
  java: "java",
  cpp: "cpp",
  go: "go",
  cs: "cs",
  c: "c"
};

const LANGUAGE_TEMPLATES: Record<SupportedLanguage, string> = {
  python: `def solution():
    # Write your code here
    print("Hello World!")

solution()`,
  javascript: `function solution() {
    // Write your code here
    console.log("Hello World!");
}

solution();`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello World!" << endl;
    return 0;
}`,
  go: `package main`,
  cs: `using System;`,
  c: `#include <stdio.h>
    int main() {
    // Write your code here
    cout << "Hello World!" << endl;
    return 0;
  }`,
};

export default function CodeEditor({
  onSubmit,
}: {
  onSubmit?: (code: string) => void;
}) {
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memory, setMemory] = useState<number | null>(null);

  const handleLanguageChange = (newLanguage: string) => {
    if (isValidLanguage(newLanguage)) {
      setLanguage(newLanguage);
      setCode(LANGUAGE_TEMPLATES[newLanguage]);
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput(null);
    setError(null);
    setExecutionTime(null);
    setMemory(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/",
        {
          code,
          language: languageMapping[language],
          input: "" // Add input field if needed
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOutput(response.data.output);
        setExecutionTime(response.data.executionTime);
        setMemory(response.data.memory);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to execute code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="cs">C#</option>
            <option value="c">C</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={runCode}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Running...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Code
                </>
              )}
            </button>
            {
              onSubmit ? (
                <button
                  onClick={() => onSubmit(code)}
                  className="bg-green-500 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  Submit
                </button>
              )
                :
                <Link
                  href="/feedback"
                  className="bg-green-500 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Running...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Link>
            }
          </div>
        </div>
        <div className="w-full h-[60vh]">
          <AceCodeEditor language={language} value={code} onChange={setCode} />
        </div>
        {/* <Editor
          height="60vh"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20 }
          }}
        /> */}
      </div>

      <Output
        output={output}
        error={error}
        isLoading={isLoading}
        executionTime={executionTime}
        memory={memory}
      />
    </div>
  );
}

// Type guard for language validation
function isValidLanguage(language: string): language is SupportedLanguage {
  return ["python", "javascript", "java", "cpp", "go", "cs", "c"].includes(language);
}
