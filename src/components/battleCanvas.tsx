import { useCallback, useEffect, useRef, useState } from "react";
import AttackDestinations from "../interfaces/attackDestinations";
import Game from "../interfaces/game";
import Player from "../interfaces/player";

const CANVAS_SIZE = 816;

interface Props {
  game: Game;
  moveSquares: number[][] | null;
  attackSquares: AttackDestinations | null;
  onMove: (pos: number[]) => void;
  isHost: boolean;
}

const getAltColor = (faction: string) => {
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
      return "#C4272F";
    case "Mongolia Alt":
      return "#F9CF02";
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
  onMove,
  isHost,
}) => {
  const [water, setWater] = useState<HTMLImageElement | null>(null);
  const [dirt, setDirt] = useState<HTMLImageElement | null>(null);
  const [hostUnit, setHostUnit] = useState<HTMLImageElement | null>(null);
  const [joinerUnit, setJoinerUnit] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileSize = CANVAS_SIZE / game.mode.board_size;

  const getImage = useCallback(
    (char: string) => {
      if (char === "w") return water;
      return dirt;
    },
    [dirt, water]
  );

  useEffect(() => {
    const dirtImage = new Image();
    dirtImage.src = require("../assets/imgs/tiles/dirt.png");
    dirtImage.onload = () => {
      setDirt(dirtImage);
    };
    const waterImage = new Image();
    waterImage.src = require("../assets/imgs/tiles/water.png");
    waterImage.onload = () => {
      setWater(waterImage);
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
      if (moveSquares) {
        onMove([x, y]);
      }
    },
    [tileSize, moveSquares, onMove, game.is_host_turn, isHost]
  );

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D, unit: HTMLImageElement, player: Player) => {
      Object.keys(player.army).forEach((i) => {
        const u = player.army[parseInt(i)];
        const height = tileSize - 2;
        const width = (unit.width * height) / unit.height;

        ctx.drawImage(
          unit,
          u.position[0] * tileSize + (tileSize / 2 - width / 2),
          u.position[1] * tileSize + (tileSize / 2 - height / 2),
          width,
          height
        );

        ctx.fillStyle = getAltColor(player.faction);
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          i,
          u.position[0] * tileSize + tileSize / 2,
          u.position[1] * tileSize + tileSize / 2
        );
      });
    },
    [tileSize]
  );

  const drawSquare = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    },
    [tileSize]
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
      const x = i % game.mode.board_size;
      const y = Math.floor(i / game.mode.board_size);
      const letter = game.map[i];
      const img = getImage(letter);
      ctx.drawImage(
        img ?? new Image(),
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
    for (let i = 0; i < game.mode.board_size; i++) {
      ctx.textAlign = "start";
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText(String.fromCharCode(65 + i), i * tileSize + 5, 15);
    }
    for (let i = 1; i < game.mode.board_size; i++) {
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText(i + 1 + "", 5, i * tileSize + 15);
    }

    drawUnits(ctx, hostUnit, game.host);
    drawUnits(ctx, joinerUnit, game.joiner);
    highlightMoves(ctx);

    for (let i = 0; i <= game.mode.board_size; i++) {
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
    game.host,
    game.joiner,
    game.map,
    game.mode.board_size,
    getImage,
    handleClick,
    highlightMoves,
    hostUnit,
    joinerUnit,
    tileSize,
    water,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-[816px] h-[816px]"
    ></canvas>
  );
};

export default BattleCanvas;
