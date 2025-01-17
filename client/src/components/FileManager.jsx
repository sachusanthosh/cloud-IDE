import PropTypes from "prop-types";

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
