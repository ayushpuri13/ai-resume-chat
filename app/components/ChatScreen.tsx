"use client";

import React from "react";
import { useState } from "react";

function ChatScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        question,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer);
  };

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about the resume..."
      />

      <button onClick={askQuestion}>Ask</button>

      <div>{answer}</div>
    </div>
  );
}
export default ChatScreen;
