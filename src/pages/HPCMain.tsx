import Dashboard from '../components/Dashboard';
import './HPCMain.css';

interface HPCMainProps {}

const HPCMain = ({}: HPCMainProps) => {
  const handleAiButtonClick = () => {
    console.log('AI button clicked');
  };

  return (
    <div id="hpc-main">
      <div className="car-normal" />
      <Dashboard gear={'D'} />
      <div className="ai-button" onClick={handleAiButtonClick} />
    </div>
  );
};

export default HPCMain;
