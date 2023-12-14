import CanvasGameBoard from "../components/CanvasGameBoard/CanvasGameBoard";
import "./Home.scss";
function Home() {
  return (
    <div className="main-container">
      {/* <button className="" type="button">
        Start
      </button> */}
      <CanvasGameBoard />
    </div>
  );
}

export default Home;
