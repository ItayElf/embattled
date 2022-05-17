type LogMessage =
  | {
      type: "log";
      content: string;
    }
  | {
      type: "chat";
      sender: string;
      content: string;
    }
  | {
      type: "turn";
      turn: number;
    };

export default LogMessage;
