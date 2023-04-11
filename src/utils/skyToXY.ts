import { type Position, distance, positionAngle } from "./distance";

export function skyToXY(center: Position, rotation: number, star: Position) {
  const dist = distance(center, star);
  const angle = positionAngle(center, star);
  return {
    distance: dist,
    x: dist * Math.cos(angle + rotation),
    y: dist * Math.sin(angle + rotation),
  };
}
