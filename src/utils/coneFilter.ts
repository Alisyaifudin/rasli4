import { type Position } from "~/utils/distance";
import { vmagToSize } from "./vmagToSize";
import { skyToXY } from "./skyToXY";

export function coneFilter(
  center: Position,
  radius: number,
  rotation: number,
  rawStars: (Position & { hex: string; vmag: string; hd: string })[]
) {
  const stars = rawStars.map((star) => {
    const { distance, x, y } = skyToXY(center, rotation, star);
    return {
      distance,
      x,
      y,
      c: star.hex,
      vmag: star.vmag,
      hd: star.hd,
    };
  });
  const inside = stars
    .filter((star) => star.distance < radius)
    .map((star) => ({
      x: star.x,
      y: star.y,
      c: star.c,
      s: vmagToSize(Number(star.vmag)),
      hd: Number(star.hd),
    }));
  return inside;
}
