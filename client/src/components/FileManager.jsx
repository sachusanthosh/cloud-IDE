import { useState } from "react";
import PropTypes from "prop-types";

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage folder expansion

  const isFolder = nodes !== null && typeof nodes === 'object'; // Check if nodes is an object (even an empty object)

  const handleFolderClick = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev); // Toggle expansion state
  };

  return (
    <div className="mx-3 text-sm">
      <div
        onClick={isFolder ? handleFolderClick : () => onSelect(path)}
        role="button"
        aria-expanded={isFolder ? isExpanded : undefined}
        className={`flex items-center p-1 rounded cursor-pointer transition-all ${
          isFolder ? "hover:bg-[#444444]" : "hover:bg-[#333333]"
        }`}
      >
        <i
          className={`bi ${
            isFolder
              ? isExpanded
                ? "bi-folder2-open"
                : "bi-folder"
              : "bi-file-earmark-code-fill"
          }`}
        ></i>
        <span className="ml-2 text-gray-300 hover:text-white">{fileName}</span>
      </div>
      {isFolder && isExpanded && (
        <ul className="ml-4 transition-all">
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={`${path}/${child}`}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FileTreeNode.propTypes = {
  fileName: PropTypes.string.isRequired,
  nodes: PropTypes.object, // Node can be an object representing children
  onSelect: PropTypes.func.isRequired, // Function to handle selection
  path: PropTypes.string.isRequired, // Path as a string
};

const FileManager = ({ tree, onSelect }) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" nodes={tree} path="" />;
};

FileManager.propTypes = {
  tree: PropTypes.object.isRequired, // Tree object representing the file structure
  onSelect: PropTypes.func.isRequired, // Function to handle selection
};

export default FileManager;
