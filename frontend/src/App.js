import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://mental-health-backend.onrender.com";

function App() {
  const [input, setInput] = useState("");
  const [advice, setAdvice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/get-advice`, {
        user_input: input,
      });

      if (response.data && response.data.advice) {
        setAdvice(response.data.advice);
      } else if (response.data && response.data.error) {
        console.error("Error from backend:", response.data.error);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      if (error.response) {
        // Backend returned an error response
        console.error("Backend error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something else went wrong
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mental Health Counselor Assistant</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          placeholder="Describe your patient's issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Get Advice</button>
      </form>
      {advice && (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          <strong>Suggested Advice:</strong>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
}

export default App;