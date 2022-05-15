import { useCallback, useEffect, useRef, useState } from "react";
import Game from "../interfaces/game";

const CANVAS_SIZE = 720;

interface Props {
  game: Game;
}

const BattleCanvas: React.FC<Props> = ({ game }) => {
  const [water, setWater] = useState<HTMLImageElement | null>(null);
  const [dirt, setDirt] = useState<HTMLImageElement | null>(null);
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
    dirtImage.src = require("../assets/imgs/dirt.png");
    dirtImage.onload = () => {
      setDirt(dirtImage);
    };
    const waterImage = new Image();
    waterImage.src = require("../assets/imgs/water.png");
    waterImage.onload = () => {
      setWater(waterImage);
    };
  }, []);

  useEffect(() => {
    if (!dirt || !water) return;
    const canv = canvasRef.current;
    if (!canv) return;
    const ctx = canv.getContext("2d");
    if (!ctx) return;

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
  }, [game.map, game.mode.board_size, getImage, tileSize, dirt, water]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-[720px] h-[720px]"
    ></canvas>
  );
};

export default BattleCanvas;
