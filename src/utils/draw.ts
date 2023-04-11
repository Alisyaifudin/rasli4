type Options = {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean;
  color: string | CanvasGradient | CanvasPattern;
};

function circle(ctx: CanvasRenderingContext2D, options: Options, alpha = 1) {
  const { x, y, radius, startAngle, endAngle, color } = options;
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fill();
}

function background(
  ctx: CanvasRenderingContext2D,
  color: string | CanvasGradient | CanvasPattern
) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function line(ctx: CanvasRenderingContext2D, edge: Edge, r: number) {
  const x1 = ((1 + edge.edge1.x / r) * ctx.canvas.width) / 2;
  const y1 = ((1 + edge.edge1.y / r) * ctx.canvas.height) / 2;
  const x2 = ((1 + edge.edge2.x / r) * ctx.canvas.width) / 2;
  const y2 = ((1 + edge.edge2.y / r) * ctx.canvas.height) / 2;
  ctx.strokeStyle = edge.in ? "#fff" : "#f00";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export type Star = {
  x: number;
  y: number;
  s: number;
  c: string;
  hd: number;
};

type Edge = {
  edge1: {
    x: number;
    y: number;
  };
  edge2: {
    x: number;
    y: number;
  };
  in: boolean;
};

export function draw(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  r: number,
  lines: (Edge | null)[]
) {
  background(ctx, "#000");
  if (!stars) return;
  if (!!lines.length) {
    for (const edge of lines) {
      if (edge) line(ctx, edge, r);
    }
  }
  for (const star of stars) {
    const options: Options = {
      x: ((1 + star.x / r) * ctx.canvas.width) / 2,
      y: ((1 + star.y / r) * ctx.canvas.height) / 2,
      radius: ((star.s / r) * ctx.canvas.height) / 2,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      counterclockwise: false,
      color: star.c,
    };

    circle(ctx, options);
    options.color = "#fff";
    options.radius = options.radius * 0.6;
    circle(ctx, options, 0.4);
    ctx.globalAlpha = 1;
  }
}
