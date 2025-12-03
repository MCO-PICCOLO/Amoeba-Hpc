import { useState, useEffect } from 'react';
import AiChat from './AiChat';
import './AiWindow.css';
import videoDisabledImage from '../assets/images/Resource-Optimization.png';
import { getFlagVideoDisabled } from '../utils/RestAPI';

interface AiWindowProps {
  keyState?: number;
  isOpen: boolean;
  onClose: () => void;
  containerNames?: string[];
  onVideoDisabledChange?: (isDisabled: boolean) => void;
}

const AiWindow = ({
  keyState,
  isOpen,
  onClose,
  containerNames = [],
  onVideoDisabledChange,
}: AiWindowProps) => {
  const scenarioChat = [
    [{ message: '"ADAS running with efficient CPU usage."', speaker: 'user' }],
    [
      {
        message: '"ADAS running with efficient CPU usage."',
        speaker: 'user',
      },
      {
        message: '"Safety CPUs overloaded, performance degraded"',
        speaker: 'user',
      },
    ],
    [
      {
        message: '"ADAS running with efficient CPU usage."',
        speaker: 'user',
      },
      {
        message: '"Safety CPUs overloaded, performance degraded"',
        speaker: 'user',
      },
      { message: '"Dynamic CPU reallocation complete"', speaker: 'User' },
    ],
  ];
  const [dialog, setDialog] = useState<
    Array<{ message: string; speaker: string }>
  >([]);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [showVideoDisabledImage, setShowVideoDisabledImage] = useState(false);

  useEffect(() => {
    console.log('keyState changed:', keyState);
    if (keyState === 2) {
      setShowVideoDisabledImage(true);
    } else if (keyState === 0) {
      setShowVideoDisabledImage(false);
    }

    if (keyState === 0 || keyState === 1 || keyState === 2 || keyState === 3) {
      setDialog(scenarioChat[keyState] || []);

      // const fullDialog = scenarioChat[keyState || 0] || [];
      // const timeouts: number[] = [];

      // fullDialog.forEach((chat, index) => {
      //   const timeoutId = setTimeout(() => {
      //     setDialog((prev) => [...prev, chat]);
      //   }, (index + 1) * 1000);
      //   timeouts.push(timeoutId);
      // });

      // return () => {
      //   timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      // };
    }
  }, [keyState]);

  // API를 통해 video disabled 상태 확인
  useEffect(() => {
    const checkVideoDisabled = async () => {
      try {
        const response = await getFlagVideoDisabled();
        const disabled = response.data?.flag_video_disabled === true;
        setIsVideoDisabled(disabled);
        if (onVideoDisabledChange) {
          onVideoDisabledChange(disabled);
        }
      } catch (error) {
        console.error('Failed to get video disabled flag:', error);
        setIsVideoDisabled(false);
        if (onVideoDisabledChange) {
          onVideoDisabledChange(false);
        }
      }
    };

    checkVideoDisabled();
    const interval = setInterval(checkVideoDisabled, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onVideoDisabledChange]);

  console.log('isVideoDisabled:', isVideoDisabled);

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
          {showVideoDisabledImage && (
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
        {/* <div className="title-area">PICCOLO Agent</div> */}
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
