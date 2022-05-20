import { useEffect, useRef } from "react";
import LogMessage from "../interfaces/logMessage";

interface Props {
  messages: LogMessage[];
  className?: string;
}

const LogArea: React.FC<Props> = ({ messages, className }) => {
  const last = useRef<HTMLDivElement>(null);
  const almostAllMessages = messages.filter(
    (_, i) => i !== messages.length - 1
  );

  useEffect(() => {
    if (last.current === null) return;
    last.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`bg-secondary-dark border-l-[16px] flex flex-col border-primary-600 ${className}`}
    >
      <div className="bg-primary-600 shadow-sm h5 pl-9 py-1 text-white">
        Logs
      </div>
      <div className="flex-1 pl-4 space-y-3 overflow-auto pr-2 scrollbar scrollbar-thumb-primary-900 scrollbar-track-primary-100">
        <div />
        {almostAllMessages.map((m, i) => (
          <LogTile message={m} key={i} />
        ))}
        {messages.length !== 0 && (
          <div ref={last}>
            <LogTile message={messages[messages.length - 1]} />
          </div>
        )}
      </div>
      <div className="h-2 bg-primary-600"></div>
    </div>
  );
};

interface LogProps {
  message: LogMessage;
}
const LogTile: React.FC<LogProps> = ({ message }) => {
  if (message.type === "log") {
    return (
      <div
        className="b1"
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    );
  } else if (message.type === "turn") {
    return (
      <div className="s1 bg-primary-600 pl-9 -ml-4 text-white mb-2 py-4">
        Turn {message.turn}
      </div>
    );
  }
  return <></>;
};

export default LogArea;
