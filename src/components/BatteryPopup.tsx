import { useState, useEffect } from 'react';
import './BatteryPopup.css';
import spinningImage from '../assets/images/spinning.png';

interface BatteryPopupProps {
  distance: number;
  percentage: number;
}

const BatteryPopup = ({ distance, percentage }: BatteryPopupProps) => {
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="battery-popup">
      {isSpinning ? (
        <img className="spinning" src={spinningImage} alt="Loading" />
      ) : (
        <>
          <div className="distance">{distance}</div>
          <div className="percentage">{percentage}</div>
          <div className="life-span"></div>
        </>
      )}
    </div>
  );
};

export default BatteryPopup;
