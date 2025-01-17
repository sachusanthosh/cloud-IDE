import { useEffect, useState } from "react";
import FileManager from "../components/FileManager";
import Terminal from "../components/Terminal";
import CodeEditor from "../components/CodeEditor";
import socket from "../utils/socket";

const Home = () => {
  const [fileTree, setFileTree] = useState({});
  const [selectedFiles, setSelectedFiles] = useState('');

  const getFileTree = async () => {
    try {
      const response = await fetch("http://localhost:3000/files");
      if (!response.ok) {
        throw new Error("Failed to fetch folder tree");
      }
      const resTree = await response.json();
      setFileTree(resTree.tree);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
    }
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", (updatedTree) => {
      setFileTree(updatedTree);
    });

    return () => {
      socket.off("file:refresh");
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-100">
      <div className="h-full w-80 bg-[#181818] border-r border-gray-700 p-4">
        <FileManager
          onSelect={(path) => setSelectedFiles(path)}
          tree={fileTree}
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-auto">
          <p className="text-xs text-gray-300">{selectedFiles.replaceAll('/', ' > ')}</p>
          <CodeEditor />
        </div>

        <div className="h-1/4 bg-black text-green-500 overflow-auto scrollbar-hide p-2">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Home;
