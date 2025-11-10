import { ButtonCell } from "./button-cell";
import type { Direction } from "../types/direction";

const LENGTH: number = 5;
const WIDTH: number = 5;

const rows: number[][] = [];
const area: number = LENGTH * WIDTH;

const facingToDirection: Record<string, Direction> = {
  NORTH: "N",
  EAST: "E",
  SOUTH: "S",
  WEST: "W",
};

interface RobotPosition {
  x: number;
  y: number;
  facing: string;
}

interface GridProps {
  robotPosition: RobotPosition | null;
  onCellClick: (x: number, y: number) => void;
}

let currentRow: number[] = [];
for (let i = 0; i < area; i++) {
  currentRow.push(i);
  if ((i + 1) % WIDTH === 0) {
    rows.unshift(currentRow);
    currentRow = [];
  }
}

export default function Grid({ robotPosition, onCellClick }: GridProps) {
  return (
    <div className="grid-wrapper">
      <table className="grid-item">
        <tbody>
          {rows.map((row, rowIndex) => {
            const y = WIDTH - 1 - rowIndex;
            return (
              <tr key={`${y}`}>
                {row.map((_, cellIndex) => {
                  const x = cellIndex;
                  const isActive =
                    robotPosition &&
                    robotPosition.x === x &&
                    robotPosition.y === y;

                  const direction = robotPosition
                    ? facingToDirection[robotPosition.facing]
                    : undefined;
                  return (
                    <ButtonCell
                      isActive={isActive ?? false}
                      direction={direction}
                      key={`${y}-${x}`}
                      cell={`${y}-${x}`}
                      onCellClick={onCellClick}
                      x={x}
                      y={y}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
