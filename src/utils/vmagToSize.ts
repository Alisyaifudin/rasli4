const interpolate = (xs: number[], ys: number[], x: number) => {
    // linearly interpolate between two points, given sets of x and y values
    // and a value of x to interpolate for
    const i = xs.findIndex((xval) => xval > x);
    if (i === 0) {
      return ys[0];
    }
    if (i === -1) {
      return ys[ys.length - 1];
    }
    const x0 = xs[i - 1];
    const x1 = xs[i];
    const y0 = ys[i - 1];
    const y1 = ys[i];
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  };
  

export const vmagToSize = (Vmag: number) => {
    const Vmags = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
    let sizes = [10, 5, 4, 3, 2, 1, 0.5, 0.3, 0.2, 0.1];
    sizes = sizes.map((size) => size * 0.1);
    return interpolate(Vmags, sizes, Vmag);
  };