import { useContext, useState } from "react";
import CanvasGameBoard from "../components/CanvasGameBoard/CanvasGameBoard";
import "./Home.scss";
import GameScoreContext from "../context/GameScoreContext";

function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const { score } = useContext(GameScoreContext);
  const updateStartStatus = () => {
    setIsStarted(false);
  };
  return (
    <div className="main-container">
      {!isStarted && (
        <button
          onClick={() => setIsStarted((prev) => !prev)}
          className="start-btn"
          type="button"
        >
          Start
        </button>
      )}
      <CanvasGameBoard
        isStarted={isStarted}
        updateStartStatus={updateStartStatus}
      />
    </div>
  );
}

export default Home;
