"use client";
import { useState } from "react";

export default function AITrainingPage() {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleTrainAI = () => {
    setOutput("");
    setRunning(true);
    const eventSource = new EventSource("http://localhost:5000/train_ai_stream");
    eventSource.onmessage = (event) => {
      setOutput((prev) => prev + event.data + "\n");
    };
    eventSource.onerror = () => {
      eventSource.close();
      setRunning(false);
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">AI Model Training</h1>
      <button
        onClick={handleTrainAI}
        disabled={running}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold mb-6 disabled:opacity-50"
      >
        {running ? "Training..." : "Train AI"}
      </button>
      <div className="bg-zinc-900 p-4 rounded-lg w-full max-w-2xl overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Live Output</h2>
        <pre className="whitespace-pre-wrap text-xs">{output}</pre>
      </div>
    </div>
  );
}