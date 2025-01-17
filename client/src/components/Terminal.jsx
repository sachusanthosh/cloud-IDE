import { Terminal as Xterminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from "../utils/socket";

const Terminal = () => {
  const termRef = useRef();

  useEffect(() => {
    const term = new Xterminal(); 
    term.open(termRef.current);

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={termRef}></div>;
};

export default Terminal;
