import GameScoreProvider from "./context/GameScoreProvider";
import Home from "./pages/Home";

function App() {
  return (
    <GameScoreProvider>
      <Home />
    </GameScoreProvider>
  );
}

export default App;
