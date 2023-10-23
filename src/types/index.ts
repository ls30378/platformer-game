import Birdman from "../entities/birdman.entity";
import Snaky from "../entities/snaky.entity";

export const getEnemyTypes = (): Record<string, any> => {
  return {
    Birdman,
    Snaky,
  };
};
