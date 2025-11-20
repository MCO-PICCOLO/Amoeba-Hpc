import { useState, useEffect } from 'react';
import AiChat from './AiChat';
import './AiWindow.css';
import videoDisabledImage from '../assets/images/video-disabled.png';
import { getFlagVideoDisabled } from '../utils/RestAPI';

interface AiWindowProps {
  keyState?: number;
  isOpen: boolean;
  onClose: () => void;
  containerNames?: string[];
}

const AiWindow = ({
  keyState,
  isOpen,
  onClose,
  containerNames = [],
}: AiWindowProps) => {
  const scenarioChat = [
    [],
    [
      { message: `“There’re some bag in the trunk”`, speaker: 'User' },
      { message: `“Want a screen alert when we get there?”`, speaker: 'AI' },
      { message: `“Yes”`, speaker: 'User' },
    ],
    [
      { message: `“Play the XXXX video.”`, speaker: 'User' },
      { message: `“Shall I play the XXXX video now?”`, speaker: 'AI' },
      { message: `“Yes”`, speaker: 'User' },
    ],
  ];
  const [dialog, setDialog] = useState<
    Array<{ message: string; speaker: string }>
  >([]);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);

  useEffect(() => {
    if (keyState === 0 || keyState === 1 || keyState === 2) {
      setDialog([]);

      const fullDialog = scenarioChat[keyState || 0] || [];
      const timeouts: number[] = [];

      fullDialog.forEach((chat, index) => {
        const timeoutId = setTimeout(() => {
          setDialog((prev) => [...prev, chat]);
        }, (index + 1) * 1000);
        timeouts.push(timeoutId);
      });

      return () => {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [keyState]);

  // API를 통해 video disabled 상태 확인
  useEffect(() => {
    const checkVideoDisabled = async () => {
      try {
        const response = await getFlagVideoDisabled();
        setIsVideoDisabled(response.data === true);
      } catch (error) {
        console.error('Failed to get video disabled flag:', error);
        setIsVideoDisabled(false);
      }
    };

    checkVideoDisabled();
  }, []);

  return (
    <div id="ai-window" className={isOpen ? 'open' : ''}>
      <div className="close-button" onClick={onClose} />
      <div className="piccolo-rule">
        <div className="title-area">PICCOLO Rule</div>
        <div className="rule-area">
          {containerNames.map((name, index) => (
            <div key={index} className="rule">
              <div className="text">{name}</div>
            </div>
          ))}
          {/* <div className="rule">
            <div className="text">aaaaaaaaaa</div>
          </div> */}
          {isVideoDisabled && (
            <div
              className="rule"
              style={{
                backgroundImage: `url(${videoDisabledImage})`,
              }}
            />
          )}
        </div>
      </div>
      <div className="divider" />
      <div className="piccolo-agent">
        <div className="title-area">PICCOLO Agent</div>
        <div className="ai-area">
          <div className="ai-symbol" />
          <div className="chat-area">
            {dialog.map((chat, index) => (
              <AiChat
                key={index}
                message={chat.message}
                speaker={chat.speaker}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiWindow;
