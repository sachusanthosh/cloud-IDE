import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useEffect, useRef } from "react";
import "xterm/css/xterm.css";
import socket from "../utils/socket";

const Terminal = () => {
  const termRef = useRef();

  useEffect(() => {
    const term = new XTerminal({
      cursorBlink: true, // Enable blinking cursor
      scrollback: 1000,  // Number of lines stored in the scrollback buffer
      theme: {
        background: "#181818", // Dark theme background
        foreground: "#ffffff", // White text
      },
    });

    const fitAddon = new FitAddon(); // Addon for dynamic resizing
    term.loadAddon(fitAddon);

    term.open(termRef.current);
    fitAddon.fit(); // Adjust the terminal size to fit the container

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });

    const handleResize = () => {
      fitAddon.fit(); // Adjust terminal size on window resize
    };
    window.addEventListener("resize", handleResize);

    return () => {
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={termRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#181818", // Ensure background matches the terminal theme
      }}
    ></div>
  );
};

export default Terminal;
