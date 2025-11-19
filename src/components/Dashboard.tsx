import { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardProps {
  gear: string;
}

const Dashboard = ({ gear }: DashboardProps) => {
  const [speed, setSpeed] = useState(30);
  const [targetSpeed, setTargetSpeed] = useState(30);

  useEffect(() => {
    const targetInterval = setInterval(() => {
      const randomSpeed = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      setTargetSpeed(randomSpeed);
    }, 3000);

    return () => clearInterval(targetInterval);
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setSpeed((currentSpeed) => {
        const diff = targetSpeed - currentSpeed;
        if (Math.abs(diff) < 0.5) {
          return targetSpeed;
        }
        return currentSpeed + diff * 0.1;
      });
    }, 300);

    return () => clearInterval(animationInterval);
  }, [targetSpeed]);

  return (
    <div id="dashboard">
      <div className="content-area">
        <div className="gear-area">
          <div className={`gear-P ${gear === 'P' ? 'active' : ''}`}>P</div>
          <div className={`gear-R ${gear === 'R' ? 'active' : ''}`}>R</div>
          <div className={`gear-N ${gear === 'N' ? 'active' : ''}`}>N</div>
          <div className={`gear-D ${gear === 'D' ? 'active' : ''}`}>D</div>
        </div>
        <div className="speedometer">
          <div className="speed">{Math.round(speed)}</div>
          <div className="unit">km/h</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
