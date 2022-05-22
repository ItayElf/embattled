import { useCallback, useEffect, useRef, useState } from "react";
import { ArmyUnit } from "../interfaces/army";
import Mode from "../interfaces/mode";
import Dirt from "../assets/imgs/tiles/dirt.svg";
import { getAltColor } from "./battleCanvas";

const CANVAS_SIZE = 816;

interface Props {
  mode: Mode;
  faction: string;
  className?: string;
  units: ArmyUnit[];
}

const ArmyViewer: React.FC<Props> = ({ mode, faction, className, units }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dirt, setDirt] = useState<HTMLImageElement | null>(null);
  const [hostUnit, setHostUnit] = useState<HTMLImageElement | null>(null);
  const [joinerUnit, setJoinerUnit] = useState<HTMLImageElement | null>(null);
  const tileSize = CANVAS_SIZE / mode.board_size;

  useEffect(() => {
    const dirtImage = new Image();
    dirtImage.src = Dirt;
    dirtImage.onload = () => {
      setDirt(dirtImage);
    };
    const hostImage = new Image();
    hostImage.src = require(`../assets/imgs/units/${faction}.svg`);
    hostImage.onload = () => {
      setHostUnit(hostImage);
    };
    const joinerImage = new Image();
    joinerImage.src = require(`../assets/imgs/units/${faction} Alt.svg`);
    joinerImage.onload = () => {
      setJoinerUnit(joinerImage);
    };
  }, [faction, mode.board_size, tileSize]);

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!hostUnit || !joinerUnit) return;
      units.forEach((u, i) => {
        const height = tileSize - 2;
        const width = (hostUnit.width * height) / hostUnit.height;
        ctx.drawImage(
          hostUnit,
          u.position[0] * tileSize + (tileSize / 2 - width / 2),
          u.position[1] * tileSize + (tileSize / 2 - height / 2),
          width,
          height
        );
        ctx.drawImage(
          joinerUnit,
          (mode.board_size - u.position[0] - 1) * tileSize +
            (tileSize / 2 - width / 2),
          (mode.board_size - u.position[1] - 1) * tileSize +
            (tileSize / 2 - height / 2),
          width,
          height
        );

        ctx.fillStyle = getAltColor(faction);
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          i + 1 + "",
          u.position[0] * tileSize + tileSize / 2,
          u.position[1] * tileSize + tileSize / 2
        );
        ctx.fillStyle = getAltColor(faction + " Alt");
        ctx.fillText(
          i + 1 + "",
          (mode.board_size - u.position[0] - 1) * tileSize + tileSize / 2,
          (mode.board_size - u.position[1] - 1) * tileSize + tileSize / 2
        );
      });
    },
    [tileSize, faction, hostUnit, joinerUnit, units, mode.board_size]
  );

  useEffect(() => {
    if (!dirt || !hostUnit || !joinerUnit) return;
    const canv = canvasRef.current;
    if (!canv) return;
    const ctx = canv.getContext("2d");
    if (!ctx) return;

    for (let i = 0; i < mode.board_size * mode.board_size; i++) {
      const x = i % mode.board_size;
      const y = Math.floor(i / mode.board_size);
      const img = dirt;
      ctx.drawImage(
        img ?? new Image(),
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }

    drawUnits(ctx);

    for (let i = 0; i < mode.board_size; i++) {
      ctx.textAlign = "start";
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText(String.fromCharCode(65 + i), i * tileSize + 5, 15);
    }
    for (let i = 1; i < mode.board_size; i++) {
      ctx.font = "12px serif";
      ctx.fillStyle = "white";
      ctx.fillText(i + 1 + "", 5, i * tileSize + 15);
    }

    for (let i = 0; i <= mode.board_size; i++) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(CANVAS_SIZE, i * tileSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, CANVAS_SIZE);
      ctx.stroke();
    }

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, (mode.board_size / 4) * tileSize);
    ctx.lineTo(CANVAS_SIZE, (mode.board_size / 4) * tileSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, ((mode.board_size * 3) / 4) * tileSize);
    ctx.lineTo(CANVAS_SIZE, ((mode.board_size * 3) / 4) * tileSize);
    ctx.stroke();
  }, [dirt, hostUnit, joinerUnit, mode.board_size, tileSize, drawUnits]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className={`w-[816px] h-[816px] ${className}`}
    />
  );
};

export default ArmyViewer;
