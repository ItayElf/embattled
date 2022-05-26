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
      className={`flex flex-col border-l-[16px] border-primary-600 bg-secondary-dark ${className}`}
    >
      <div className="s1 lg:h5 bg-primary-600 py-1 pl-9 text-white shadow-sm">
        Logs
      </div>
      <div className="flex-1 space-y-3 overflow-auto pl-4 pr-2 scrollbar scrollbar-track-primary-100 scrollbar-thumb-primary-900">
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
        className="caption lg:b1"
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    );
  } else if (message.type === "turn") {
    return (
      <div className="s1 -ml-4 mb-2 bg-primary-600 py-2 pl-9 text-white lg:py-4">
        Turn {message.turn}
      </div>
    );
  }
  return <></>;
};

export default LogArea;
