import Editor from "@monaco-editor/react";
import PropTypes from "prop-types";

const CodeEditor = ({ value, onChange }) => {
  return (

      <Editor
        height="90vh"
        language="javascript"
        value={value}
        theme="vs-dark"
        onChange={(newValue) => onChange(newValue)}
      />

  );
};

CodeEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CodeEditor;
