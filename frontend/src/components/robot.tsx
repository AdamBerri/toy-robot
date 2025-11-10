import "./Robot.css";
import type { Direction } from "../types/direction";

function getArrow(direction: Direction) {
  const arrows = {
    N: "▲",
    S: "▼",
    E: "▶",
    W: "◀",
  };
  return arrows[direction];
}

export function Robot({ direction }: { direction?: Direction }) {
  return (
    <div className="robot-container" data-direction={direction}>
      <div className="robot">
        <div className="robot-head">
          <div className="robot-eye"></div>
          <div className="robot-eye"></div>
        </div>
        <div className="robot-body"></div>
      </div>
      {direction && (
        <div className="direction-arrow">{getArrow(direction)}</div>
      )}
    </div>
  );
}
