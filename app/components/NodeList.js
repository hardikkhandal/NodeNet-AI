"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Parallax } from "react-parallax";
import { motion } from "framer-motion";
import "../Style/NodeListStyle.css";
import BackgroundPhoto from "../media/background-home.jpg"; // Assuming you have a stylesheet for the NodeList

export default function NodeList() {
  const imageUrl = BackgroundPhoto.src;
  const [nodes, setNodes] = useState([]);
  const [prompt, setPrompt] = useState(""); // State to manage the prompt input
  const [output, setOutput] = useState(""); // State to manage the output
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/central-node/nodes"
        );
        setNodes(response.data); // Set the fetched nodes
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    // Initial fetch
    fetchNodes();

    // Fetch nodes every 1.5 seconds
    const interval = setInterval(() => {
      fetchNodes();
    }, 1500);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <Parallax
      className="node-list-background"
      bgImage={imageUrl}
      strength={300}
    >
      <div className="node-list-container">
        <motion.h2
          className="node-list-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        >
          Available Nodes
        </motion.h2>

        <motion.table
          className="node-table"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Groq ID</th>
              <th>Distance (km)</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.id}>
                <td>{node.name}</td>
                <td>{node.groqId}</td>
                <td>{node.distance}</td>
                <td style={{ color: node.available ? "green" : "red" }}>
                  {node.available ? "Available" : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </Parallax>
  );
}
