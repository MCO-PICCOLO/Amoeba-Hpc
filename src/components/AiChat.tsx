import './AiChat.css';

interface AiChatProps {
  message: string;
  speaker: string;
}

const AiChat = ({ message, speaker }: AiChatProps) => {
  return (
    <div className={`ai-chat ${speaker === 'AI' ? 'from-ai' : ''}`}>
      <div className="text-area">{message}</div>
    </div>
  );
};

export default AiChat;
