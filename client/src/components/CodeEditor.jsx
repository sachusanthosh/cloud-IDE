import Editor from "@monaco-editor/react";
// import { useState } from "react";

const CodeEditor = () => {

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
