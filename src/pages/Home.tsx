import { useContext, useState } from "react";
import CanvasGameBoard from "../components/CanvasGameBoard/CanvasGameBoard";
import "./Home.scss";
import GameScoreContext from "../context/GameScoreContext";

enum GameStatus {
  NOT_STARTED = 0,
  STARTED = 1,
  RESTARTED = 2,
}

function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NOT_STARTED
  );
  const { score, setScore } = useContext(GameScoreContext);
  const updateStartStatus = () => {
    setGameStatus(GameStatus.RESTARTED);
  };

  const getButtonText = () => {
    if (gameStatus === GameStatus.NOT_STARTED) return "click to start";
    return (
      <>
        your score: {score}
        <br />
        click to restart
      </>
    );
  };

  const startGame = () => {
    setScore(0);
    setGameStatus(GameStatus.STARTED);
  };
  return (
    <div className="main-container">
      {gameStatus !== GameStatus.STARTED && (
        <button onClick={startGame} className="start-btn" type="button">
          {getButtonText()}
        </button>
      )}
      <CanvasGameBoard
        isStarted={gameStatus === GameStatus.STARTED}
        updateStartStatus={updateStartStatus}
      />
    </div>
  );
}

export default Home;
