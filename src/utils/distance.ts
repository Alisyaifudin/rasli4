export type Position = {
  ra: number; //in degree
  dec: number; //in degree
};

function hav(theta: number /*in radian*/) {
  return Math.sin(theta / 2) ** 2;
}
function inverHav(x: number) {
  // use the cosine formula
  // https://en.wikipedia.org/wiki/Haversine_formula
  const cosTheta = 1 - 2 * x;
  return Math.acos(cosTheta);
}

export function distance(a: Position, b: Position) {
  // use haversine formula
  // https://en.wikipedia.org/wiki/Haversine_formula
  const dLat = ((a.dec - b.dec) * Math.PI) / 180;
  const dLon = ((a.ra - b.ra) * Math.PI) / 180;
  const lat1 = (a.dec * Math.PI) / 180;
  const lat2 = (b.dec * Math.PI) / 180;
  const havTheta = hav(dLat) + Math.cos(lat1) * Math.cos(lat2) * hav(dLon);
  const theta = inverHav(havTheta);
  return (theta * 180) / Math.PI;
}

export function positionAngle(center: Position, target: Position) {
  // find the angle between the north pole and the target seen from the center
  // use four part formula
  // https://en.wikipedia.org/wiki/Spherical_trigonometry
  const lat1 = (center.dec * Math.PI) / 180;
  const lat2 = (target.dec * Math.PI) / 180;
  const dLon = ((target.ra - center.ra) * Math.PI) / 180;
  const x = Math.sin(dLon);
  const y = Math.tan(lat2) * Math.cos(lat1) - Math.sin(lat1) * Math.cos(dLon);
  const theta = Math.atan2(y, x);
  return theta;
}
