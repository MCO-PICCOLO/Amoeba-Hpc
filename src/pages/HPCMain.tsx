import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import { getKeyState, getContainerNames } from '../utils/RestAPI';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);
  const [keyState, setKeyState] = useState<number>(0);
  const [containerNames, setContainerNames] = useState<string[]>([]);

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
          console.log('Container names loaded:', result.data.container_names);
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
        console.log('API Response:', result); // 전체 응답 로그

        if (result.success && result.data) {
          const serverState = result.data.state || result.data;
          const numericState = parseInt(String(serverState), 10);

          console.log(
            `Raw server state: ${serverState} (type: ${typeof serverState})`,
          );
          console.log(
            `Parsed numeric state: ${numericState} (type: ${typeof numericState})`,
          );
          console.log(`Current keyState: ${keyState}`);

          // 항상 업데이트 (디버깅용)
          if (!isNaN(numericState)) {
            setKeyState(numericState);
            console.log(`State updated to: ${numericState}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch key state from server:', error);
      }
    };

    // 즉시 한 번 실행
    fetchKeyState();

    // 1초마다 서버에서 keyState 가져오기
    const interval = setInterval(fetchKeyState, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []); // keyState를 의존성에서 제거

  const handleAiButtonClick = () => {
    console.log('AI button clicked');
    setIsAiWindowOpen(true);
  };

  const handleCloseAiWindow = () => {
    setIsAiWindowOpen(false);
  };

  const gear = keyState === 4 ? 'P' : 'D';

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
      <div className="battery-indicator" />
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
