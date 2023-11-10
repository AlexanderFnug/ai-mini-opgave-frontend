"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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

  // const try2 = `Question1: "What is the definition of a static web app?" Answer1: "A static web app is a website that consists of static web pages, where the content remains the same for all users and does not change dynamically based on user interactions or data input. These web apps are typically built using HTML, CSS, and JavaScript, and do not require server-side processing. They are well-suited for displaying informational content or providing a simple user interface."`;
  // useEffect(() => {
  //   if (try2.includes("Question2:")) {
  //     setAiAnswer(
  //       try2.substring(try2.indexOf("Answer1:"), try2.indexOf("Question2:"))
  //     );
  //   } else {
  //     setAiAnswer(
  //       try2.substring(try2.indexOf("Answer1:"), try2.length)
  //     );
  //   }
  // }, []);
  // console.log(try2.indexOf("Answer1:"), "aiAnswer");

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
  console.log(aiAnswer, "<--aiAnswer", aiQuestion, "<--aiQuestion", aiAnswer2, "<--aiAnswer2", aiQuestion2, "<--aiQuestion2")
  
  return (
    <section className={styles.container}>
      <h1>AI Exam helper</h1>
      <p className={styles.description}>
        Copy and paste your exam question to the input and click send. The AI
        teacher will then ask you questions, that you can answer. When you're ready, click the question to see the answer.
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
