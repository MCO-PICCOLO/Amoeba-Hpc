import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import popImage from '../assets/images/pop.png';
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

    // 컨테이너 이름들 가져오기
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

  // keyState 변경 시 API 호출
  useEffect(() => {
    const handleKeyStateChange = async () => {
      if (previousKeyState === -1 || previousKeyState === keyState) return;

      try {
        switch (keyState) {
          case 0:
            await postDrivingStatus('AD');
            await postResetDemo();
            break;
          case 1:
            await getSound1();
            await postScene1();
            break;
          case 2:
            await getSound2();
            await postScene2();
            break;
          case 3:
            await postDrivingStatus('MD');
            setTimeout(async () => {
              await postKeyState('8');
            }, 3000);
            break;
          case 4:
            await postDrivingStatus('PK');
            await postScene4();
            setTimeout(async () => {
              await postKeyState('8');
            }, 3000);
            break;
          default:
            break;
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
    await postKeyState('8');

    setIsPopupOpen(false);
  };

  const gear = keyState === 4 ? 'P' : 'D';

  // battery-indicator 스타일 (keyState 9일 때)
  const batteryIndicatorStyle =
    keyState === 9
      ? {
          borderColor: '#5C4AFF',
          borderWidth: '8px',
          borderRadius: '24px',
          borderStyle: 'solid',
          boxSizing: 'border-box' as const,
          backgroundClip: 'padding-box' as const,
          backgroundOrigin: 'padding-box' as const,
        }
      : {
          border: '0.75px solid rgba(255, 255, 255, 0.7)',
          borderRadius: '22.5px',
          boxSizing: 'border-box' as const,
          backgroundClip: 'padding-box' as const,
          backgroundOrigin: 'padding-box' as const,
        };

  return (
    <div id="hpc-main">
      <div
        className={`car-normal ${isAiWindowOpen ? 'shrink' : ''} ${
          keyState === 3 ? 'md-mode' : ''
        } ${keyState === 4 ? 'parking-mode' : ''}`}
      >
        {keyState === 3 && (
          <div className="toaster">Video disabled while MD</div>
        )}
        {keyState === 4 && (
          <div className="toaster">Please check the trunk.</div>
        )}
      </div>
      <Dashboard gear={gear} isAiWindowOpen={isAiWindowOpen} />
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
    </div>
  );
};

export default HPCMain;
