import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);
  const [keyState, setKeyState] = useState<number>(0);

  useEffect(() => {
    const imagesToPreload = [
      '/src/assets/images/AD_CAR.png',
      '/src/assets/images/MD_CAR.png',
      '/src/assets/images/Parking_CAR.png',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;

      // 0, 1, 2, 3, 4, 5 키 입력 처리
      if (key >= '0' && key <= '5') {
        const value = parseInt(key);
        setKeyState(value);
        console.log(`Key pressed: ${key}, State changed to: ${value}`);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const handleAiButtonClick = () => {
    console.log('AI button clicked');
    setIsAiWindowOpen(true);
  };

  const handleCloseAiWindow = () => {
    setIsAiWindowOpen(false);
  };

  const gear = keyState === 5 ? 'P' : 'D';

  return (
    <div id="hpc-main">
      <div
        className={`car-normal ${isAiWindowOpen ? 'shrink' : ''} ${
          keyState === 4 ? 'md-mode' : ''
        } ${keyState === 5 ? 'parking-mode' : ''}`}
      >
        {keyState === 4 && (
          <div className="toaster">Video disabled while MD</div>
        )}
        {keyState === 5 && (
          <div className="toaster">Please check the trunk.</div>
        )}
      </div>
      <Dashboard gear={gear} isAiWindowOpen={isAiWindowOpen} />
      {!isAiWindowOpen && (
        <div className="ai-button" onClick={handleAiButtonClick} />
      )}
      <div className="battery-indicator" />
      <AiWindow
        keyState={keyState}
        isOpen={isAiWindowOpen}
        onClose={handleCloseAiWindow}
      />
    </div>
  );
};

export default HPCMain;
