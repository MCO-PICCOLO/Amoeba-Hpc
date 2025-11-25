import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import popImage from '../assets/images/pop.png';
import Video1 from '../assets/videos/Video1.mp4';
import {
  getKeyState,
  getContainerNames,
  postDrivingStatus,
  postResetDemo,
  getSound1,
  getSound2,
  postScene1,
  postScene2,
  postScene4,
  postKeyState,
} from '../utils/RestAPI';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);
  const [keyState, setKeyState] = useState<number>(0);
  const [containerNames, setContainerNames] = useState<string[]>([]);
  const [previousKeyState, setPreviousKeyState] = useState<number>(-1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [displayMode, setDisplayMode] = useState<number>(0); // 실제 표시할 모드 (3 or 4)
  const [carModeClass, setCarModeClass] = useState<string>('ad-mode');
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);

  useEffect(() => {
    const imagesToPreload = [
      '/src/assets/images/AD_CAR.webp',
      '/src/assets/images/MD_CAR.webp',
      '/src/assets/images/Parking_CAR.png',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // 컨테이너 이름들 1초마다 가져오기
    const fetchContainerNames = async () => {
      try {
        const result = await getContainerNames();
        if (result.success && result.data) {
          setContainerNames(result.data.container_names || []);
        }
      } catch (error) {
        console.error('Failed to fetch container names:', error);
      }
    };

    fetchContainerNames();
    const interval = setInterval(fetchContainerNames, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchKeyState = async () => {
      try {
        const result = await getKeyState();

        if (result.success && result.data) {
          const serverState = result.data.state || result.data;
          const numericState = parseInt(String(serverState), 10);

          if (!isNaN(numericState)) {
            setKeyState((prevKeyState) => {
              if (numericState !== prevKeyState) {
                setTimeout(() => setPreviousKeyState(prevKeyState), 0);
                return numericState;
              }
              return prevKeyState;
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch key state from server:', error);
      }
    };

    fetchKeyState();
    const interval = setInterval(fetchKeyState, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // keyState 변경 시 displayMode, carModeClass 업데이트 (AD: 0,1,2 / MD: 3 / Parking: 4 / 9: 변경 없음)
  useEffect(() => {
    const handleKeyStateChange = async () => {
      if (previousKeyState === -1 || previousKeyState === keyState) return;

      try {
        if ([0, 1, 2].includes(keyState)) {
          setDisplayMode(1); // AD 모드
          setCarModeClass('ad-mode');
          setShowToast(false);
          if (keyState === 2) {
            setIsVideoPlayerVisible(true);
          }
        } else if (keyState === 3) {
          setDisplayMode(3); // MD 모드
          setCarModeClass('md-mode');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
          setIsVideoPlayerVisible(false);
        } else if (keyState === 4) {
          setDisplayMode(4); // Parking 모드
          setCarModeClass('parking-mode');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        } else if (keyState == 8 || keyState === 9) {
          // 특별한 모드 변경 없음
        } else {
          setShowToast(false);
          setCarModeClass('');
        }
      } catch (error) {
        console.error(`Error handling keyState ${keyState}:`, error);
      }
    };

    handleKeyStateChange();
  }, [keyState, previousKeyState]);

  const handleAiButtonClick = () => {
    setIsAiWindowOpen(true);
  };

  const handleCloseAiWindow = () => {
    setIsAiWindowOpen(false);
  };

  const handleBatteryClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = async () => {
    postKeyState('8');
    setIsPopupOpen(false);
  };

  const gear = carModeClass === 'parking-mode' ? 'P' : 'D';

  // battery-indicator 스타일 (keyState 9일 때)
  const batteryIndicatorStyle =
    keyState === 9
      ? {
          outline: '8px solid #5C4AFF',
          outlineOffset: '0px',
          borderRadius: '24px',
        }
      : {
          outline: '0.75px solid rgba(255, 255, 255, 0.7)',
          outlineOffset: '0px',
          borderRadius: '22.5px',
        };

  return (
    <div id="hpc-main">
      <div
        className={`car-normal ${carModeClass} ${
          isAiWindowOpen ? 'shrink' : ''
        }`}
      >
        {showToast && displayMode === 3 && (
          <div className="toaster">Video disabled while MD</div>
        )}
        {showToast && displayMode === 4 && (
          <div className="toaster">Please check the trunk.</div>
        )}
      </div>
      <Dashboard
        gear={gear}
        mode={carModeClass}
        isAiWindowOpen={isAiWindowOpen}
      />
      {!isAiWindowOpen && (
        <div className="ai-button" onClick={handleAiButtonClick} />
      )}
      <div
        className="battery-indicator"
        style={batteryIndicatorStyle}
        onClick={handleBatteryClick}
      />
      {isPopupOpen && (
        <div
          className="popup-overlay"
          onClick={handlePopupClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <img
            src={popImage}
            alt="Popup"
            style={{
              width: '1086px',
              height: '619px',
            }}
          />
        </div>
      )}
      <AiWindow
        keyState={keyState}
        isOpen={isAiWindowOpen}
        onClose={handleCloseAiWindow}
        containerNames={containerNames}
      />
      {isVideoPlayerVisible && (
        <video
          className="video-player"
          src={Video1}
          autoPlay
          loop
          muted
        />
      )}
    </div>
  );
};

export default HPCMain;
