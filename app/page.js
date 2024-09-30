"use client";

import React, { useState, useEffect } from "react";
import NodeList from "./components/NodeList";
import PromptForm from "./components/PromptForm";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <NodeList />
      <PromptForm />
      <Footer />
    </>
  );
}
