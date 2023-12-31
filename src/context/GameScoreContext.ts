import React, { createContext } from "react";
type GameScoreContextType = {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

const defaultValue: GameScoreContextType = {
  score: -1,
  setScore: () => {},
};

const GameScoreContext = createContext<GameScoreContextType>(defaultValue);
export default GameScoreContext;
