import PropTypes from "prop-types";
import fs from "fs/promises"

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isFolder = nodes;

  return (
    <div
      className="mx-3"
      onClick={(e) => {
        e.stopPropagation();
        if (isFolder) return;
        onSelect(path);
      }}
    >
      <i
        className={`bi ${isFolder ? "bi-folder" : "bi-file-earmark-code-fill"}`}
      ></i>
      <span
        className={`ml-2 ${isFolder ? "cursor-default" : "cursor-pointer"}`}
      >
        {fileName}
      </span>
      {isFolder && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
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

const FileManager = ({ tree, onSelect }) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" nodes={tree} path="" />;
};

FileTreeNode.propTypes = {
  fileName: PropTypes.any,
  nodes: PropTypes.any,
};

export default FileManager;
