import { useCallback, useEffect, useRef, useState } from "react";
import AttackDestinations from "../interfaces/attackDestinations";
import Game from "../interfaces/game";
import Player from "../interfaces/player";
import Dirt from "../assets/imgs/tiles/dirt.svg";
import Water from "../assets/imgs/tiles/water.svg";
import Forest from "../assets/imgs/tiles/forest.svg";

const CANVAS_SIZE = 816;

interface Props {
  game: Game;
  moveSquares: number[][] | null;
  attackSquares: AttackDestinations | null;
  visible: number[][];
  onMove: (pos: number[]) => void;
  onAttack: (pos: number[]) => void;
  isHost: boolean;
}

export const getAltColor = (faction: string) => {
  switch (faction) {
    case "England":
      return "#FFFAEF";
    case "England Alt":
      return "#F03134";
    case "India":
      return "#128807";
    case "India Alt":
      return "#128807";
    case "Mongolia":
      return "#FFFFFF";
    case "Mongolia Alt":
      return "#121212";
    case "Norway":
      return "#BA0C2F";
    case "Norway: Alt":
      return "#015197";
    case "Mercenaries":
      return "#FFFAEF";
    case "Mercenaries Alt":
      return "#121212";
    default:
      return "white";
  }
};

const BattleCanvas: React.FC<Props> = ({
  game,
  moveSquares,
  attackSquares,
  visible,
  onMove,
  onAttack,
  isHost,
}) => {
  const [water, setWater] = useState<HTMLImageElement | null>(null);
  const [dirt, setDirt] = useState<HTMLImageElement | null>(null);
  const [forest, setForest] = useState<HTMLImageElement | null>(null);
  const [hostUnit, setHostUnit] = useState<HTMLImageElement | null>(null);
  const [joinerUnit, setJoinerUnit] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileSize = CANVAS_SIZE / game.mode.board_size;
  const boardSize = game.mode.board_size;

  const getImage = useCallback(
    (char: string) => {
      if (char === "w") return water;
      if (char === "f") return forest;
      return dirt;
    },
    [dirt, water, forest]
  );

  const isVisible = useCallback(
    (pos: number[]) => {
      for (let i = visible.length - 1; i > -1; i--) {
        if (visible[i][0] === pos[0] && visible[i][1] === pos[1]) {
          return true;
        }
      }
      return false;
    },
    [visible]
  );

  useEffect(() => {
    const dirtImage = new Image();
    dirtImage.src = Dirt;
    dirtImage.onload = () => {
      setDirt(dirtImage);
    };
    const waterImage = new Image();
    waterImage.src = Water;
    waterImage.onload = () => {
      setWater(waterImage);
    };
    const forestImage = new Image();
    forestImage.src = Forest;
    forestImage.onload = () => {
      setForest(forestImage);
    };
    const hostImage = new Image();
    hostImage.src = require(`../assets/imgs/units/${game.host.faction}.svg`);
    hostImage.onload = () => {
      setHostUnit(hostImage);
    };
    const joinerImage = new Image();
    joinerImage.src = require(`../assets/imgs/units/${game.joiner.faction}.svg`);
    joinerImage.onload = () => {
      setJoinerUnit(joinerImage);
    };
  }, [game.host.faction, game.joiner.faction]);

  const handleClick = useCallback(
    (canvas: HTMLCanvasElement, e: MouseEvent) => {
      if (game.is_host_turn !== isHost) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / tileSize);
      const y = Math.floor((e.clientY - rect.top) / tileSize);
      const newX = isHost ? x : boardSize - x - 1;
      const newY = isHost ? y : boardSize - y - 1;
      if (moveSquares) {
        onMove([newX, newY]);
      } else if (attackSquares) {
        onAttack([newX, newY]);
      }
    },
    [
      tileSize,
      moveSquares,
      attackSquares,
      onMove,
      onAttack,
      game.is_host_turn,
      isHost,
      boardSize,
    ]
  );

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D, unit: HTMLImageElement, player: Player) => {
      Object.keys(player.army).forEach((i) => {
        const u = player.army[parseInt(i)];
        if (!isVisible(u.position)) return;
        const height = tileSize - 2;
        const width = (unit.width * height) / unit.height;

        const x = isHost ? u.position[0] : boardSize - u.position[0] - 1;
        const y = isHost ? u.position[1] : boardSize - u.position[1] - 1;

        ctx.drawImage(
          unit,
          x * tileSize + (tileSize / 2 - width / 2),
          y * tileSize + (tileSize / 2 - height / 2),
          width,
          height
        );

        ctx.fillStyle = getAltColor(player.faction);
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          i,
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2
        );
      });
    },
    [tileSize, isVisible, boardSize, isHost]
  );

  const drawSquare = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      const newX = isHost ? x : boardSize - x - 1;
      const newY = isHost ? y : boardSize - y - 1;
      ctx.fillRect(newX * tileSize, newY * tileSize, tileSize, tileSize);
    },
    [tileSize, boardSize, isHost]
  );

  const highlightMoves = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (moveSquares) {
        moveSquares.forEach((pos) =>
          drawSquare(ctx, pos[0], pos[1], "rgba(255, 0, 0, 0.5)")
        );
      } else if (attackSquares) {
        attackSquares.melee.forEach((pos) =>
          drawSquare(ctx, pos[0], pos[1], "rgba(255, 0, 0, 0.5)")
        );
        attackSquares.range.forEach((pos) =>
          drawSquare(ctx, pos[0], pos[1], "rgba(255, 255, 0, 0.5)")
        );
      }
    },
    [moveSquares, attackSquares, drawSquare]
  );

  useEffect(() => {
    if (!dirt || !water || !hostUnit || !joinerUnit) return;
    const canv = canvasRef.current;
    if (!canv) return;
    const ctx = canv.getContext("2d");
    if (!ctx) return;

    // if (typeof canv.onclick == "undefined")
    canv.onclick = (e) => handleClick(canv, e);
    for (let i = 0; i < game.map.length; i++) {
      const [baseX, baseY] = [i % boardSize, Math.floor(i / boardSize)];
      const x = isHost ? i % boardSize : boardSize - (i % boardSize) - 1;
      const y = isHost
        ? Math.floor(i / boardSize)
        : boardSize - Math.floor(i / boardSize) - 1;
      const letter = game.map[i];
      const img = getImage(letter);
      ctx.drawImage(
        img ?? new Image(),
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
      if (!isVisible([baseX, baseY])) {
        drawSquare(ctx, baseX, baseY, "rgba(0,0,0,0.5)");
      }
    }
    for (let i = 0; i < boardSize; i++) {
      ctx.textAlign = "start";
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText(
        String.fromCharCode(65 + (isHost ? i : boardSize - i - 1)),
        i * tileSize + 5,
        15
      );
    }
    for (let i = 1; i < boardSize; i++) {
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText((isHost ? boardSize - i : i + 1) + "", 5, i * tileSize + 15);
    }

    if (game.last_move !== null) {
      game.last_move.forEach((pos) => {
        console.log(pos);
        if (isVisible(pos)) {
          drawSquare(ctx, pos[0], pos[1], "rgba(255, 255, 0, 0.5)");
        }
      });
    }

    drawUnits(ctx, hostUnit, game.host);
    drawUnits(ctx, joinerUnit, game.joiner);
    highlightMoves(ctx);

    for (let i = 0; i <= boardSize; i++) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(CANVAS_SIZE, i * tileSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, CANVAS_SIZE);
      ctx.stroke();
    }
  }, [
    dirt,
    drawUnits,
    drawSquare,
    game.host,
    game.joiner,
    game.map,
    boardSize,
    game.last_move,
    getImage,
    handleClick,
    highlightMoves,
    hostUnit,
    isVisible,
    isHost,
    joinerUnit,
    tileSize,
    visible,
    water,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-[816px] h-[816px]"
    />
  );
};

export default BattleCanvas;
