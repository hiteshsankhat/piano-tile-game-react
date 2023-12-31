import React, { useState } from "react";
import GameScoreContext from "./GameScoreContext";

type GameScoreProviderType = {
  children: React.ReactNode;
};

const GameScoreProvider = ({ children }: GameScoreProviderType) => {
  const [score, setScore] = useState(0);
  return (
    <GameScoreContext.Provider value={{ score, setScore }}>
      {children}
    </GameScoreContext.Provider>
  );
};

export default GameScoreProvider;
