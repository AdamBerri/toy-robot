import type { Direction } from "../types/direction";
import { Robot } from "./robot";

export function ButtonCell(props: {
  cell: string;
  isActive: boolean;
  direction?: Direction;
  onCellClick: (x: number, y: number) => void;
  x: number;
  y: number;
}) {
  const handleClick = () => {
    props.onCellClick(props.x, props.y);
  };

  return (
    <td>
      <button key={props.cell} onClick={handleClick}>
        {props.isActive ? <Robot direction={props.direction} /> : ""}
      </button>
    </td>
  );
}
