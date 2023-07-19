import { useEffect, useState } from "react";

// const PARENT_APP_URL =
//   process.env.NEXT_PUBLIC_PARENT_APP_URL ?? "http://127.0.0.1:4300";

export default function App() {
  const [token, setToken] = useState("");
  const [getToggle, setToggle] = useState(false);
  useEffect(() => {
    const handler = (event) => {
      // if (event.origin !== PARENT_APP_URL) {
      //   // skip other messages from(for ex.) extensions
      //   return;
      // }
      const message = event.data;

      if (message?.type === "token-from-parent") {
        setToken(message.value);
        console.log("Received Token from Parent", message);
      } else {
        console.error("NOT_VALID_MESSAGE");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setToken]);

  useEffect(() => {
    if (token) {
      const interval = window.setInterval(() => {
        postMessage({
          type: "token-expired-from-child",
          value: token
        });
        setToken("");
      }, 5000); // every 5 seconds
      return () => clearInterval(interval);
    }
  }, [token, setToken]);

  const postMessage = (message) => {
    window.parent.postMessage(message, "*");
  };

  const toggleTheme = () => {
    setToggle(() => !getToggle);
    postMessage({
      type: "token-from-child",
      value: !getToggle
    });
  };

  return (
    <div>
      <h2>Event Tracker POC APP</h2>
      <h3>Token from parent: {token || "NOT_VALID"}</h3>
      <div>{token ? "*will expire in 5 seconds" : ""}</div>
      <button onClick={toggleTheme}>Toggle {getToggle ? "ON" : "OFF"}</button>
    </div>
  );
}
