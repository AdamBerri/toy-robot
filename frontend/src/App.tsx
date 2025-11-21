import "./App.css";
import Grid from "./components/grid";
import { useEffect, useState, useCallback } from "react";

interface RobotPosition {
  x: number;
  y: number;
  facing: string;
}
// Create a button called “Display History” that upon click displays the last ten positions of the robot. For example:
// PLACE 0, 0, NORTH
// MOVE
// MOVE
// RIGHT
// MOVE
// PLACE 4, 4 NORTH
// LEFT
// MOVE
// DISPLAY HISTORY

// Should render in the DOM
// [0, 0] → [0, 1] → [0, 2] → [1, 2] → [4, 4] → [3, 4]
function App() {
  const [robotPosition, setRobotPosition] = useState<RobotPosition | null>(
    null
  );
  const [robotHistory, setRobotHistory] = useState<string | null>(null);
  const fetchRobotPosition = async () => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const response = await fetch("http://localhost:3000/robot", {
        headers,
      });
      const data = await response.json();
      if (data.data) {
        setRobotPosition(data.data);
      } else {
        setRobotPosition(null);
      }
    } catch (error) {
      console.error("Failed to fetch robot position:", error);
      setRobotPosition(null);
    }
  };
  // Send command to backend
  const sendCommand = async (
    command: string,
    x?: number,
    y?: number,
    facing?: string
  ) => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const body: { command: string; x?: number; y?: number; facing?: string } =
        { command };
      if (x !== undefined) body.x = x;
      if (y !== undefined) body.y = y;
      if (facing !== undefined) body.facing = facing;

      const response = await fetch("http://localhost:3000/robot/command", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setRobotPosition(data.data);
      } else {
        console.error("Command failed:", data.message);
      }
    } catch (error) {
      console.error("Failed to send command:", error);
    }
  };

  // API Helper Functions
  const placeRobot = useCallback(
    async (x: number, y: number, facing: string) => {
      await sendCommand("PLACE", x, y, facing);
    },
    []
  );

  const moveRobot = useCallback(async () => {
    await sendCommand("MOVE");
  }, []);

  const rotateLeft = useCallback(async () => {
    await sendCommand("LEFT");
  }, []);

  const rotateRight = useCallback(async () => {
    await sendCommand("RIGHT");
  }, []);

  const reportRobot = useCallback(async () => {
    const response = await fetch("http://localhost:3000/robot/history?max=1", {
      method: "GET",
    });
    const history = await response.json();
    if (!history.data) {
      console.log("no data was found");
    }
    const historyData = history.data;
    const historyCoords = [];

    for (const record of historyData) {
      const xCoord = record.x;
      const yCoord = record.y;
      const coordinate = `[${xCoord},${yCoord}]`;
      historyCoords.push(coordinate);
    }

    const formattedHistory = historyCoords.join(" → ");
    setRobotHistory(formattedHistory);
    console.log(historyCoords.join(" → "), "lalalalalalalalalalaalalal");

    if (robotPosition) {
      alert(
        `Robot Position:\nX: ${robotPosition.x}\nY: ${robotPosition.y}\nFacing: ${robotPosition.facing}`
      );
    } else {
      alert("No robot placed yet!");
    }
  }, [robotPosition]);

  // Get the initial robot position
  useEffect(() => {
    fetchRobotPosition();
  }, []);

  // Do keyboard stuff
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
      }

      switch (event.key) {
        case "ArrowLeft":
          rotateLeft();
          break;
        case "ArrowUp":
          moveRobot();
          break;
        case "ArrowRight":
          rotateRight();
          break;
        case "ArrowDown":
          console.log("do nothing");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveRobot, reportRobot, rotateLeft, rotateRight]);

  // deal with the cell click
  const handleCellClick = (x: number, y: number) => {
    placeRobot(x, y, "NORTH");
  };

  return (
    <>
      <div className="app">
        <div className="container">
          <div className="instructions">
            <p> Click to place the robot, use the buttons or arrows to move</p>
          </div>

          <div className="grid">
            <Grid robotPosition={robotPosition} onCellClick={handleCellClick} />
          </div>

          <div className="options">
            <button onClick={rotateLeft}>Left</button>
            <button onClick={moveRobot}>Move</button>
            <button onClick={rotateRight}>Right</button>
          </div>

          <div className="report">
            <button onClick={reportRobot}>Report</button>
          </div>
        </div>
        <div className="history">
          <p>{robotHistory}</p>
        </div>
      </div>
    </>
  );
}

export default App;
