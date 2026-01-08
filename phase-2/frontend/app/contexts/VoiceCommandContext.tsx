"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VoiceCommand {
  action: "add" | "mark-complete" | "delete" | "update";
  taskId?: number;
  title?: string;
  newTitle?: string;
}

interface VoiceCommandContextType {
  onCommandRecognized: ((command: VoiceCommand) => void) | null;
  onError: ((error: string) => void) | null;
  registerHandlers: (
    onCommand: (command: VoiceCommand) => void,
    onError: (error: string) => void
  ) => void;
  unregisterHandlers: () => void;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(
  undefined
);

export function VoiceCommandProvider({ children }: { children: ReactNode }) {
  const [onCommandRecognized, setOnCommandRecognized] = useState<
    ((command: VoiceCommand) => void) | null
  >(null);
  const [onError, setOnError] = useState<((error: string) => void) | null>(
    null
  );

  const registerHandlers = (
    onCommand: (command: VoiceCommand) => void,
    onErr: (error: string) => void
  ) => {
    setOnCommandRecognized(() => onCommand);
    setOnError(() => onErr);
  };

  const unregisterHandlers = () => {
    setOnCommandRecognized(null);
    setOnError(null);
  };

  return (
    <VoiceCommandContext.Provider
      value={{
        onCommandRecognized,
        onError,
        registerHandlers,
        unregisterHandlers,
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
}

export function useVoiceCommand() {
  const context = useContext(VoiceCommandContext);
  if (context === undefined) {
    throw new Error(
      "useVoiceCommand must be used within a VoiceCommandProvider"
    );
  }
  return context;
}

