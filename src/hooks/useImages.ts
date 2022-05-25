import { useEffect, useState } from "react";
import Dirt from "../assets/imgs/tiles/dirt.svg";
import Water from "../assets/imgs/tiles/water.svg";
import Forest from "../assets/imgs/tiles/forest.svg";

export const useTiles = () => {
  const [water, setWater] = useState<HTMLImageElement | null>(null);
  const [dirt, setDirt] = useState<HTMLImageElement | null>(null);
  const [forest, setForest] = useState<HTMLImageElement | null>(null);

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
  }, []);

  return [dirt, water, forest];
};

export const usePlayerUnits = (faction: string) => {
  const [playerInfantry, setPlayerInfantry] = useState<HTMLImageElement | null>(
    null
  );
  const [playerCavalry, setPlayerCavalry] = useState<HTMLImageElement | null>(
    null
  );
  const [playerRanged, setPlayerRanged] = useState<HTMLImageElement | null>(
    null
  );
  const [playerUtility, setPlayerUtility] = useState<HTMLImageElement | null>(
    null
  );

  useEffect(() => {
    const playerInfantryImage = new Image();
    playerInfantryImage.src = require(`../assets/imgs/units/${faction} Infantry.svg`);
    playerInfantryImage.onload = () => {
      setPlayerInfantry(playerInfantryImage);
    };
    const playerCavalryImage = new Image();
    playerCavalryImage.src = require(`../assets/imgs/units/${faction} Cavalry.svg`);
    playerCavalryImage.onload = () => {
      setPlayerCavalry(playerCavalryImage);
    };
    const playerRangedImage = new Image();
    playerRangedImage.src = require(`../assets/imgs/units/${faction} Ranged.svg`);
    playerRangedImage.onload = () => {
      setPlayerRanged(playerRangedImage);
    };
    const playerUtilityImage = new Image();
    playerUtilityImage.src = require(`../assets/imgs/units/${faction} Utility.svg`);
    playerUtilityImage.onload = () => {
      setPlayerUtility(playerUtilityImage);
    };
  }, [faction]);

  return [playerInfantry, playerCavalry, playerRanged, playerUtility];
};
