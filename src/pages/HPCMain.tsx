import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import AiWindow from '../components/AiWindow';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const [isAiWindowOpen, setIsAiWindowOpen] = useState(false);

  const handleAiButtonClick = () => {
    console.log('AI button clicked');
    setIsAiWindowOpen(true);
  };

  const handleCloseAiWindow = () => {
    setIsAiWindowOpen(false);
  };

  return (
    <div id="hpc-main">
      <div className={`car-normal ${isAiWindowOpen ? 'shrink' : ''}`} />
      <Dashboard gear={'D'} isAiWindowOpen={isAiWindowOpen} />
      <div className="ai-button" onClick={handleAiButtonClick} />
      <AiWindow isOpen={isAiWindowOpen} onClose={handleCloseAiWindow} />
    </div>
  );
};

export default HPCMain;
