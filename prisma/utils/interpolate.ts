export default function interpolate(xs: number[], ys: number[], x: number)  {
    const xmax = Math.max(...xs);
    const xmin = Math.min(...xs);
    const ymax = Math.max(...ys);
    const ymin = Math.min(...ys);
    if (x < xmax && x > xmin) {
      const i = xs.findIndex((x0) => x0 > x);
  
      const x0 = xs[i - 1] || xmin;
      const x1 = xs[i] || xmax;
      const y0 = ys[i - 1] || ymin;
      const y1 = ys[i] || ymax;
      const result = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      return result;
    } else if (x < xmin) {
      return ymin;
    } else {
      return ymax;
    }
  };