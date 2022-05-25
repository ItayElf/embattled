import { useCallback, useEffect, useRef } from "react";
import { ArmyUnit } from "../interfaces/army";
import Mode from "../interfaces/mode";
import { getAltColor } from "./battleCanvas";
import { usePlayerUnits, useTiles } from "../hooks/useImages";

const CANVAS_SIZE = 816;

interface Props {
  mode: Mode;
  faction: string;
  className?: string;
  units: ArmyUnit[];
}

const ArmyViewer: React.FC<Props> = ({ mode, faction, className, units }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dirt, ,] = useTiles();
  const [hostInfantry, hostCavalry, hostRanged, hostUtility] =
    usePlayerUnits(faction);
  const [joinerInfantry, joinerCavalry, joinerRanged, joinerUtility] =
    usePlayerUnits(faction + " Alt");
  const tileSize = CANVAS_SIZE / mode.board_size;

  const getUnitImage = useCallback(
    (unitClass: string, isHost: boolean) => {
      const splt = unitClass.split(" ");
      const val = splt[splt.length - 1];
      if (isHost) {
        if (val === "Infantry") return hostInfantry;
        else if (val === "Cavalry") return hostCavalry;
        else if (val === "Ranged") return hostRanged;
        else if (val === "Utility") return hostUtility;
      } else {
        if (val === "Infantry") return joinerInfantry;
        else if (val === "Cavalry") return joinerCavalry;
        else if (val === "Ranged") return joinerRanged;
        else if (val === "Utility") return joinerUtility;
      }
      throw Error("Invalid unit class: " + unitClass);
    },
    [
      hostCavalry,
      hostInfantry,
      hostRanged,
      hostUtility,
      joinerCavalry,
      joinerInfantry,
      joinerRanged,
      joinerUtility,
    ]
  );

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      units.forEach((u, i) => {
        const height = tileSize - 2;
        const unitImage = getUnitImage(u.clas, true);
        if (!unitImage) return;
        const width = (unitImage.width * height) / unitImage.height;
        ctx.drawImage(
          unitImage,
          u.position[0] * tileSize + (tileSize / 2 - width / 2),
          u.position[1] * tileSize + (tileSize / 2 - height / 2),
          width,
          height
        );
        const joinerImage = getUnitImage(u.clas, false);
        if (!joinerImage) return;
        ctx.drawImage(
          joinerImage,
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
    [tileSize, faction, units, mode.board_size, getUnitImage]
  );

  useEffect(() => {
    if (!dirt) return;
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
      ctx.fillText(mode.board_size - i + "", 5, i * tileSize + 15);
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
  }, [dirt, mode.board_size, tileSize, drawUnits]);

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
