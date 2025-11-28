import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import popImage from '../assets/images/pop.png';
import Video1 from '../assets/videos/Video1.mp4';
import parkingImage from '../assets/images/Parking_CAR.png';
import parkingImageafter from '../assets/images/Parking_CAR_O.webp';
import adIcon from '../assets/images/F_CAR.png';
import {
  KeyState,
  DisplayMode,
  CarMode,
  ParkingStage,
  type KeyStateType,
  type DisplayModeType,
  type CarModeType,
  type ParkingStageType,
} from '../constants/AppConstants';
import {
  getKeyState,
  getContainerNames,
  //postDrivingStatus,
  //postResetDemo,
  //getSound1,
  //getSound2,
  //postScene1,
  //postScene2,
  //postScene4,
  postKeyState,
} from '../utils/RestAPI';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);
  const [keyState, setKeyState] = useState<KeyStateType>(KeyState.RESET);
  const [containerNames, setContainerNames] = useState<string[]>([]);
  const [previousKeyState, setPreviousKeyState] = useState<KeyStateType | -1>(-1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayModeType>(DisplayMode.INITIAL);
  const [carModeClass, setCarModeClass] = useState<CarModeType>(CarMode.AD);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [parkingStage, setParkingStage] = useState<ParkingStageType>(ParkingStage.NONE);
  const [adIconY, setAdIconY] = useState(0);
  const [adIconDirection, setAdIconDirection] = useState(1); // 1 for down, -1 for up

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

    // Set random initial Y position for ad icon (below dashboard)
    const dashboardBottom = 210;
    const maxIconSize = 600; // 4x larger
    setAdIconY(dashboardBottom + Math.random() * (1080 - dashboardBottom - maxIconSize));

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

  // Ad icon vertical animation with size scaling
  useEffect(() => {
    const dashboardBottom = 210; // Dashboard ends at ~207px, add some margin
    const maxSize = 600; // 4x larger: was 150, now 600
    const speed = 2;

    const animationFrame = setInterval(() => {
      setAdIconY((prevY) => {
        let newY = prevY + speed * adIconDirection;
        
        // Bounce at dashboard bottom and screen bottom
        if (newY <= dashboardBottom) {
          setAdIconDirection(1);
          return dashboardBottom;
        }
        if (newY >= 1080 - maxSize) {
          setAdIconDirection(-1);
          return 1080 - maxSize;
        }
        
        return newY;
      });
    }, 16); // ~60fps

    return () => clearInterval(animationFrame);
  }, [adIconDirection]);

  // Calculate icon size based on Y position (larger at bottom, smaller at top)
  // Adjust calculation to work with new range (210px to 480px) - 4x larger: 200px to 600px
  const adIconSize = 200 + ((adIconY - 210) / (1080 - 210)) * 400; // Size ranges from 200px to 600px

  // Calculate X position for lane (perspective effect - lanes converge at top)
  // At top (y=210): narrower lane offset, At bottom (y=480): wider lane offset
  const laneOffsetFromCenter = 50 + ((adIconY - 210) / (1080 - 210)) * 100; // Offset: 50px to 150px from center
  const carX = (1920 / 2) - laneOffsetFromCenter - (adIconSize / 2); // Left lane position

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
                setTimeout(() => setPreviousKeyState(prevKeyState as KeyStateType), 0);
                return numericState as KeyStateType;
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
        if (keyState === KeyState.RESET) {
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
          setIsVideoPlayerVisible(false);
        } else if (keyState === KeyState.VIDEO_PLAY) {
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
            setTimeout(() => {
              setIsVideoPlayerVisible(true);
            }, 3000);
        } else if (keyState === KeyState.APPLY_POLICY) {
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
          setIsVideoPlayerVisible(false);
        } else if (keyState === KeyState.NOTI_TRUNK) {
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
        }
        else if (keyState === KeyState.PARKING) {
          setDisplayMode(DisplayMode.PARKING_MODE);
          setCarModeClass(CarMode.PARKING);
          setParkingStage(ParkingStage.INITIAL);
          if (previousKeyState === KeyState.NOTI_TRUNK) {
            setTimeout(() => {
              setParkingStage(ParkingStage.AFTER_DELAY);
            }, 1000);
          }
        } else if (keyState === KeyState.BATTERY_CLOSE || keyState === KeyState.BATTERY_HIGHLIGHT) {
          // 특별한 모드 변경 없음
        } else {
          setShowToast(false);
          setCarModeClass(CarMode.AD);
        }
      } catch (error) {
        console.error(`Error handling keyState ${keyState}:`, error);
      }
    };

    handleKeyStateChange();
  }, [keyState, previousKeyState, isVideoDisabled]);

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
    postKeyState(String(KeyState.BATTERY_CLOSE));
    setIsPopupOpen(false);
  };

  const handleVideoDisabledChange = (isDisabled: boolean) => {
    setIsVideoDisabled(isDisabled);
  };

  const gear = carModeClass === 'parking-mode' ? 'P' : 'D';

  // parking mode background image based on stage
  const parkingBackgroundImage = (() => {
    if (carModeClass !== CarMode.PARKING) return 'none';
    // parkingStage 2 means show the _after_ image (Parking_CAR_O.webp)
    return parkingStage === ParkingStage.AFTER_DELAY ? `url(${parkingImageafter})` : `url(${parkingImage})`;
  })();

  // battery-indicator 스타일 (keyState 9일 때)
  const batteryIndicatorStyle =
    keyState === KeyState.BATTERY_HIGHLIGHT
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
        style={carModeClass === CarMode.PARKING ? {
          backgroundImage: parkingBackgroundImage,
        } : {}}
      >
        {showToast && displayMode === DisplayMode.MD_MODE && (
          <div className="toaster">Video disabled while MD</div>
        )}
        {showToast && displayMode === DisplayMode.PARKING_MODE && (
          <div className="toaster">Please check the trunk.</div>
        )}
        <img
          src={adIcon}
          alt="Moving Car"
          className="moving-ad-icon"
          style={{
            left: `${carX}px`,
            top: `${adIconY}px`,
            width: `${adIconSize}px`,
            height: `${adIconSize}px`,
          }}
        />
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
        onVideoDisabledChange={handleVideoDisabledChange}
      />
      {isVideoPlayerVisible && (
        <video
          className="video-player"
          src={Video1}
          autoPlay
          loop
        />
      )}
    </div>
  );
};

export default HPCMain;
