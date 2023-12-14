import { useEffect, useRef } from "react";
import "./Tile.scss";

type TileProps = { boardHeight: number };

export const Tile = ({ boardHeight }: TileProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClicked = () => {
    if (buttonRef.current) {
      buttonRef.current.style.opacity = "0.5";
    }
  };
  useEffect(() => {
    let positionY = 0;
    let velocityY = 1;
    let requestAnimationFrameId: number | null = null;
    const fallingAnimation = () => {
      positionY += velocityY;
      if (buttonRef.current !== null) {
        buttonRef.current.style.top = `${positionY}px`;
      }
      if (
        positionY >=
        boardHeight - (buttonRef.current?.getBoundingClientRect().height ?? 0)
      ) {
        buttonRef.current?.remove();
        return;
      }
      requestAnimationFrameId = requestAnimationFrame(() => fallingAnimation());
    };
    fallingAnimation();

    return () => {
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
    };
  }, [boardHeight]);
  return (
    <button
      onClick={handleClicked}
      ref={buttonRef}
      className="tile"
      type="button"
    ></button>
  );
};
