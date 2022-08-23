import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useState } from "react";
// import { screenshotWeb } from "./utils";

function App() {
  const [url, setURL] = useState("");

  const handleScreenShot = async () => {
    try {
      if (url.length > 0) {
        const response = await axios.get(`http://localhost:3500/screenshot`, {
          responseType: "arraybuffer",
          headers: {
            Accept: "image/jpeg",
          },
          params: {
            url: decodeURIComponent(url),
          },
        });
        const blob = new Blob([response.data], {
          type: "image/jpeg",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "screenshot.jpg");
        link.click();
        console.log(response);
      }
      // return response;
    } catch (error) {
      alert("Insert a valid URL");
    }
  };

  // const handleScreenShot = () => {
  //   screenshotWeb(url);
  // };

  return (
    <div className="App">
      <header className="App-header">
          <input
            type="text"
            onChange={(e) => setURL(e.target.value)}
            placeholder="Enter URL here"
          />
          <button onClick={handleScreenShot}>Download Screenshot</button>
      </header>
    </div>
  );
}

export default App;
