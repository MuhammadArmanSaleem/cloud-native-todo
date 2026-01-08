"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useVoiceCommand } from "../../contexts/VoiceCommandContext";
import { uiCopy } from "../../content/uiCopy";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export default function VoiceCommand() {
  const { language } = useLanguage();
  const { onCommandRecognized, onError } = useVoiceCommand();
  const t = uiCopy[language];
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) {
        onError("Speech recognition is not supported in this browser.");
      }
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === "ur" ? "ur-PK" : "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setRecognizedText(transcript);

      // Process final result
      if (event.results[event.resultIndex].isFinal) {
        processCommand(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (onError) {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setRecognizedText("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onError, onCommandRecognized]);

  const processCommand = (text: string) => {
    if (!onCommandRecognized) {
      if (onError) {
        onError("Voice command handlers not registered.");
      }
      return;
    }

    const lowerText = text.toLowerCase().trim();

    // Parse "add a new task [title]" or "create task [title]"
    const addMatch = lowerText.match(/(?:add|create)\s+(?:a\s+)?(?:new\s+)?task\s+(.+)/i);
    if (addMatch) {
      const title = addMatch[1].trim();
      onCommandRecognized({
        action: "add",
        title: title,
      });
      return;
    }

    // Parse "mark task [id] as complete" or "complete task [id]"
    const completeMatch = lowerText.match(/(?:mark|complete)\s+task\s+(\d+)\s*(?:as\s+complete)?/i);
    if (completeMatch) {
      const taskId = parseInt(completeMatch[1], 10);
      onCommandRecognized({
        action: "mark-complete",
        taskId: taskId,
      });
      return;
    }

    // Parse "delete task [id]"
    const deleteMatch = lowerText.match(/delete\s+task\s+(\d+)/i);
    if (deleteMatch) {
      const taskId = parseInt(deleteMatch[1], 10);
      onCommandRecognized({
        action: "delete",
        taskId: taskId,
      });
      return;
    }

    // Parse "update task [id] title to [new title]"
    const updateMatch = lowerText.match(/update\s+task\s+(\d+)\s+title\s+to\s+(.+)/i);
    if (updateMatch) {
      const taskId = parseInt(updateMatch[1], 10);
      const newTitle = updateMatch[2].trim();
      onCommandRecognized({
        action: "update",
        taskId: taskId,
        newTitle: newTitle,
      });
      return;
    }

    // Command not recognized
    if (onError) {
      onError("Command not recognized. Please try again.");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      if (onError) {
        onError("Speech recognition is not available.");
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setRecognizedText("");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setRecognizedText("");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        if (onError) {
          onError("Failed to start voice recognition. Please check microphone permissions.");
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
          isListening
            ? "bg-destructive text-destructive-foreground animate-pulse"
            : "bg-card text-foreground hover:bg-muted border border-border"
        }`}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
        aria-pressed={isListening}
      >
        <svg
          className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isListening ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      </button>
      {recognizedText && (
        <span className="text-xs text-muted-foreground max-w-xs truncate">
          {recognizedText}
        </span>
      )}
    </div>
  );
}

