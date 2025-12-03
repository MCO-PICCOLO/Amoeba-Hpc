import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import Video1 from '../assets/videos/Video1.mp4';
import parkingImage from '../assets/images/Parking_CAR.png';
import parkingImageafter from '../assets/images/Parking_CAR_O.webp';
import leftCarImage from '../assets/images/left_car.png';
import rightCarImage from '../assets/images/right_car.png';
import batteryPopImage from '../assets/images/battery-pop.png';
import batteryLifespanImage from '../assets/images/battery-lifespan.png';
import spinningImage from '../assets/images/spinning.png';
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
import BatteryPopup from '../components/BatteryPopup';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);
  const [keyState, setKeyState] = useState<KeyStateType>(KeyState.RESET);
  const [containerNames, setContainerNames] = useState<string[]>([
    '"ADAS Active"',
  ]);
  const [previousKeyState, setPreviousKeyState] = useState<KeyStateType | -1>(
    -1,
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayModeType>(
    DisplayMode.INITIAL,
  );
  const [carModeClass, setCarModeClass] = useState<CarModeType>(CarMode.AD);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [parkingStage, setParkingStage] = useState<ParkingStageType>(
    ParkingStage.NONE,
  );

  // ===== CAR MOVEMENT CONFIGURATION =====
  const LEFT_CAR_BASE_SIZE = 100; // Base size in pixels at the top (smallest)
  const RIGHT_CAR_BASE_SIZE = 100; // Base size in pixels at the top (smallest)
  const PERSPECTIVE = 0.7; // Size increase per pixel of Y movement (perspective effect)
  const BASE_SPEED = 1; // Base speed in pixels per frame
  const SPEED_RANDOMNESS = 0.3; // Random variation in speed (±30%)

  // Left car coordinates
  const LEFT_CAR_POINT1 = { x: 250, y: 200 };
  const LEFT_CAR_POINT2 = { x: -150, y: 600 };

  // Right car coordinates
  const RIGHT_CAR_POINT1 = { x: 730, y: 300 };
  const RIGHT_CAR_POINT2 = { x: 830, y: 700 };
  // ======================================

  const [leftCarPosition, setLeftCarPosition] = useState({
    x: LEFT_CAR_POINT1.x,
    y: LEFT_CAR_POINT1.y,
  });
  const [rightCarPosition, setRightCarPosition] = useState({
    x: RIGHT_CAR_POINT1.x,
    y: RIGHT_CAR_POINT1.y,
  });
  const [leftCarMovingTo2, setLeftCarMovingTo2] = useState(true);
  const [rightCarMovingTo2, setRightCarMovingTo2] = useState(true);
  const [leftCarSpeed, setLeftCarSpeed] = useState(BASE_SPEED);
  const [rightCarSpeed, setRightCarSpeed] = useState(BASE_SPEED);

  const initDistance = 195;
  const maxDistance = 370;
  const [curDistance, setCurDistance] = useState(initDistance);

  // curDistance를 1분(60초)에 1씩 감소
  useEffect(() => {
    const interval = setInterval(() => {
      setCurDistance((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // 1분 = 60000ms
    return () => clearInterval(interval);
  }, []);

  // keyState가 RESET이면 curDistance를 maxDistance로 초기화
  useEffect(() => {
    if (keyState === KeyState.RESET) {
      setCurDistance(initDistance);
    }
  }, [keyState]);

  useEffect(() => {
    const imagesToPreload = [
      '/src/assets/images/AD_CAR.webp',
      '/src/assets/images/MD_CAR.webp',
      '/src/assets/images/Parking_CAR.png',
      // BatteryPopup 관련 이미지 미리 로드
      batteryPopImage,
      batteryLifespanImage,
      spinningImage,
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // 컨테이너 이름들 1초마다 가져오기
    // const fetchContainerNames = async () => {
    //   try {
    //     const result = await getContainerNames();
    //     if (result.success && result.data) {
    //       setContainerNames(result.data.container_names || []);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch container names:', error);
    //   }
    // };

    // fetchContainerNames();
    // const interval = setInterval(fetchContainerNames, 1000);
    // return () => clearInterval(interval);
  }, []);

  // Left car direction change (every 1 second)
  useEffect(() => {
    const directionChange = setInterval(() => {
      setLeftCarPosition((prev) => {
        const criteria = 0.001 * prev.y + 0.1;
        setLeftCarMovingTo2(Math.random() > criteria);
        // Set new random speed
        const randomFactor = 1 + (Math.random() * 2 - 1) * SPEED_RANDOMNESS;
        setLeftCarSpeed(BASE_SPEED * randomFactor);
        return prev; // Don't change position
      });
    }, 1000); // Every 1 second

    return () => clearInterval(directionChange);
  }, []);

  // Left car movement animation
  // useEffect(() => {
  //   const animationFrame = setInterval(() => {
  //     setLeftCarPosition((prev) => {
  //       const baseTarget = leftCarMovingTo2 ? LEFT_CAR_POINT2 : LEFT_CAR_POINT1;
  //       const target = {
  //         x: baseTarget.x,
  //         y: baseTarget.y,
  //       };

  //       const dx = target.x - prev.x;
  //       const dy = target.y - prev.y;
  //       const distance = Math.sqrt(dx * dx + dy * dy);

  //       const ratio = leftCarSpeed / distance;
  //       return {
  //         x: prev.x + dx * ratio,
  //         y: prev.y + dy * ratio,
  //       };
  //     });
  //   }, 16); // ~60fps

  //   return () => clearInterval(animationFrame);
  // }, [leftCarMovingTo2, leftCarSpeed]);

  // Right car direction change (every 1 second)
  useEffect(() => {
    const directionChange = setInterval(() => {
      setRightCarPosition((prev) => {
        const criteria = 0.001 * prev.y;
        setRightCarMovingTo2(Math.random() > criteria);
        // Set new random speed
        const randomFactor = 1 + (Math.random() * 2 - 1) * SPEED_RANDOMNESS;
        setRightCarSpeed(BASE_SPEED * randomFactor);
        return prev; // Don't change position
      });
    }, 1000); // Every 1 second

    return () => clearInterval(directionChange);
  }, []);

  // Right car movement animation
  // useEffect(() => {
  //   const animationFrame = setInterval(() => {
  //     setRightCarPosition((prev) => {
  //       const baseTarget = rightCarMovingTo2
  //         ? RIGHT_CAR_POINT2
  //         : RIGHT_CAR_POINT1;
  //       const target = {
  //         x: baseTarget.x,
  //         y: baseTarget.y,
  //       };

  //       const dx = target.x - prev.x;
  //       const dy = target.y - prev.y;
  //       const distance = Math.sqrt(dx * dx + dy * dy);

  //       const ratio = rightCarSpeed / distance;
  //       return {
  //         x: prev.x + dx * ratio,
  //         y: prev.y + dy * ratio,
  //       };
  //     });
  //   }, 16); // ~60fps

  //   return () => clearInterval(animationFrame);
  // }, [rightCarMovingTo2, rightCarSpeed]);

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
                setTimeout(
                  () => setPreviousKeyState(prevKeyState as KeyStateType),
                  0,
                );
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
          setContainerNames(['"ADAS Active"']);
        } else if (keyState === KeyState.VIDEO_PLAY) {
          setContainerNames(['"ADAS Active"', '"LKAS Active"']);
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
          setTimeout(() => {
            setIsVideoPlayerVisible(true);
          }, 3000);
        } else if (keyState === KeyState.APPLY_POLICY) {
          setContainerNames(['"ADAS Active"', '"LKAS Active"']);
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
          setIsVideoPlayerVisible(false);
        } else if (keyState === KeyState.NOTI_TRUNK) {
          setDisplayMode(DisplayMode.AD_MODE);
          setCarModeClass(CarMode.AD);
          setParkingStage(ParkingStage.NONE);
        } else if (keyState === KeyState.PARKING) {
          setDisplayMode(DisplayMode.PARKING_MODE);
          setCarModeClass(CarMode.PARKING);
          setParkingStage(ParkingStage.INITIAL);
          if (previousKeyState === KeyState.NOTI_TRUNK) {
            setTimeout(() => {
              setParkingStage(ParkingStage.AFTER_DELAY);
            }, 1000);
          }
        } else if (keyState === KeyState.BATTERY_HIGHLIGHT) {
          // setIsPopupOpen(true);
        } else if (keyState === KeyState.BATTERY_CLOSE) {
          // setIsPopupOpen(false);
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

  // Calculate car sizes based on Y position (perspective effect)
  const leftCarSize = LEFT_CAR_BASE_SIZE + leftCarPosition.y * PERSPECTIVE;
  const rightCarSize = RIGHT_CAR_BASE_SIZE + rightCarPosition.y * PERSPECTIVE;

  const gear = carModeClass === 'parking-mode' ? 'P' : 'D';

  // parking mode background image based on stage
  const parkingBackgroundImage = (() => {
    if (carModeClass !== CarMode.PARKING) return 'none';
    // parkingStage 2 means show the _after_ image (Parking_CAR_O.webp)
    return parkingStage === ParkingStage.AFTER_DELAY
      ? `url(${parkingImageafter})`
      : `url(${parkingImage})`;
  })();

  // battery-indicator 스타일 (keyState 9일 때)
  const batteryIndicatorStyle =
    keyState === KeyState.BATTERY_HIGHLIGHT
      ? {
          outline: '8px solid #5C4AFF',
          outlineOffset: '0px',
          borderRadius: '24px',
        }
      : {};

  return (
    <div id="hpc-main">
      <div
        className={`car-normal ${carModeClass} ${
          isAiWindowOpen ? 'shrink' : ''
        }`}
        style={
          carModeClass === CarMode.PARKING
            ? {
                backgroundImage: parkingBackgroundImage,
              }
            : {}
        }
      >
        {showToast && displayMode === DisplayMode.MD_MODE && (
          <div className="toaster">Video disabled while MD</div>
        )}
        {showToast && displayMode === DisplayMode.PARKING_MODE && (
          <div className="toaster">Please check the trunk.</div>
        )}
        <img
          src={leftCarImage}
          alt="Left Car"
          className="moving-car"
          style={{
            left: `${leftCarPosition.x}px`,
            top: `${leftCarPosition.y}px`,
            width: `${leftCarSize}px`,
            height: `${leftCarSize}px`,
          }}
        />
        <img
          src={rightCarImage}
          alt="Right Car"
          className="moving-car"
          style={{
            left: `${rightCarPosition.x}px`,
            top: `${rightCarPosition.y}px`,
            width: `${rightCarSize}px`,
            height: `${rightCarSize}px`,
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
      >
        <div className="battery-percent">
          {Math.round((curDistance / maxDistance) * 100)}%
        </div>
        <div className="battery-distance">{curDistance} km</div>
      </div>
      <AiWindow
        keyState={keyState}
        isOpen={isAiWindowOpen}
        onClose={handleCloseAiWindow}
        containerNames={containerNames}
        onVideoDisabledChange={handleVideoDisabledChange}
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
            zIndex: 4000,
          }}
        >
          <BatteryPopup
            distance={curDistance}
            percentage={Math.round((curDistance / maxDistance) * 100)}
          />
        </div>
      )}
      {isVideoPlayerVisible && (
        <video className="video-player" src={Video1} autoPlay loop />
      )}
    </div>
  );
};

export default HPCMain;
