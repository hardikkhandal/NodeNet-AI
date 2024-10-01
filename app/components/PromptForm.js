"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../Style/PromptFormStyle.css";
import { Parallax } from "react-parallax";
import BackgroundPhoto from "../media/footer.png"; // Background image

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const messages = [
    "Submit Your Prompt",
    "Type Your Question Here",
    "Ask Anything",
  ];
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 150; // Speed of typing
  const deletingSpeed = 50; // Speed of deleting
  const pauseTime = 1000; // Pause after typing

  useEffect(() => {
    let timer;

    const typeMessage = () => {
      const currentMessage = messages[messageIndex];
      if (!isDeleting) {
        if (displayText.length < currentMessage.length) {
          setDisplayText(currentMessage.slice(0, displayText.length + 1));
        } else {
          setIsDeleting(true);
          timer = setTimeout(typeMessage, pauseTime);
        }
      } else {
        if (displayText.length > 1) {
          // Keep one letter at least
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    timer = setTimeout(typeMessage, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, messageIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://decentralizationllms-production.up.railway.app/api/central-node/process-prompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );
      //
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setOutput(data.choices[0].message.content); // Access the content directly
      } else {
        setOutput("No output received."); // Fallback message if no output
      }

      console.log(output); // Assuming the output is in data.output
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <Parallax
      className="prompt-form-background" // Add a class for the parallax background
      bgImage={BackgroundPhoto.src}
      strength={300}
    >
      <div className="prompt-form-container">
        <motion.h2
          className="prompt-form-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        >
          {displayText} {/* Display the animated text */}
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
          ></textarea>
          <div className="button-container">
            <motion.button
              type="submit"
              className="submit-button"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Submit
            </motion.button>
          </div>
        </form>

        {output && (
          <div className="output-container">
            <motion.h3
              className="output-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
            >
              Output
            </motion.h3>
            <p className="output-text">{output}</p>
          </div>
        )}
      </div>
    </Parallax>
  );
}
