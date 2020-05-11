import React from "react";
import { ipcRenderer } from "electron";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            ipcRenderer.send("write-file", {
              message: "hello world from renderer",
            });
          }}
        >
          click me here
        </button>
      </header>
    </div>
  );
}

export default App;
