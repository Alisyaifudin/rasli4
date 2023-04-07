import interpolate from "./interpolate";
import rgbToHex from "./rgb-to-hex";

export type ColorFile = {
  bv: number;
  T: number;
  hex: string;
  des: number;
  r: number;
  g: number;
  b: number;
};

export default function bvToRGB(bv: (number | null)[], arr: ColorFile[]) {
  const bvs = arr.map(({ bv }) => Number(bv));
  const rs = arr.map(({ r }) => Number(r));
  const gs = arr.map(({ g }) => Number(g));
  const bs = arr.map(({ b }) => Number(b));
  const color = bv.map((b_v) => {
    const r = !!b_v ? interpolate(bvs, rs, b_v) : 255;
    const g = !!b_v ? interpolate(bvs, gs, b_v) : 255;
    const b = !!b_v ? interpolate(bvs, bs, b_v) : 255;
    return rgbToHex(r, g, b);
  });
  return color;
}
