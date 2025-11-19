import './AiWindow.css';

interface AiWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiWindow = ({ isOpen, onClose }: AiWindowProps) => {
  return (
    <div id="ai-window" className={isOpen ? 'open' : ''}>
      <button className="close-button" onClick={onClose}>
        ✕
      </button>
      <div className="ai-content">
        <h2>AI Assistant</h2>
        {/* AI 윈도우 내용을 여기에 추가 */}
      </div>
    </div>
  );
};

export default AiWindow;
