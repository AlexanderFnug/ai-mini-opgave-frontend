"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [AIResponse, setAIResponse] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer2, setAiAnswer2] = useState("");
  const [aiQuestion2, setAiQuestion2] = useState("");
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  const SERVER_URL = "http://localhost:8080/api/exam2/limited";

  const getAIres = async () => {
    setBtnClicked(true);
    try {
      const response = await fetch(
        `${SERVER_URL}?about=${encodeURIComponent(userInput)}`
      );
      const data = await handleHttpErrors(response);
      console.log(data);
      setAIResponse(data.answer);

      const try1 = data.answer;

      setAiQuestion(
        try1.substring(try1.indexOf("Question1:"), try1.indexOf("Answer1:"))
      );

      if (try1.includes("Question2:")) {
        setAiAnswer(
          try1.substring(try1.indexOf("Answer1:"), try1.indexOf("Question2:"))
        );
        setAiQuestion2(
          try1.substring(try1.indexOf("Question2:"), try1.indexOf("Answer2:"))
        );
        setAiAnswer2(
          try1.substring(try1.indexOf("Answer2:"), try1.length)
        );
      } else {
        setAiAnswer(try1.substring(try1.indexOf("Answer1:"), try1.length));
      }
    } catch (error) {
      console.error(
        "There was an error reading the exam questions:",
        error.message
      );
    }
  };

  async function handleHttpErrors(res) {
    if (!res.ok) {
      const errorResponse = await res.json();
      const msg = errorResponse.message
        ? errorResponse.message
        : "No error details provided";
      throw new Error(msg);
    }
    return res.json();
  }

  console.log(aiAnswer, "<--aiAnswer", aiQuestion, "<--aiQuestion", aiAnswer2, "<--aiAnswer2", aiQuestion2, "<--aiQuestion2");
  
  return (
    <section className={styles.container}>
      <h1>AI Exam helper</h1>
      <p className={styles.description}>
        Copy and paste your exam question to the input and click send. The AI
        teacher will then ask you questions, that you can answer. When you are ready, click the question to see the answer.
      </p>
      <div className={styles.conversation}>
        <input
          type="text"
          id="about2"
          className={styles.input}
          placeholder="Paste exam question here"
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button className={styles.button} onClick={getAIres}>
          Send
        </button>
        {btnClicked && !AIResponse && (
          <h3 className={styles.loading}>Loading...</h3>
        )}
        <div className={styles.grid}>
          <p className={styles.AIQuestion} onClick={() => setShowAnswer1(!showAnswer1)}>{aiQuestion}</p>
          {showAnswer1 && <p className={styles.AIAnswer}>{aiAnswer}</p>}
          <p className={styles.AIQuestion} onClick={() => setShowAnswer2(!showAnswer2)}>{aiQuestion2}</p>
          {showAnswer2 && <p className={styles.AIAnswer}>{aiAnswer2}</p>}
        </div>
      </div>
    </section>
  );
}
