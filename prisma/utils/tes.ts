import { z } from "zod";
import readJson from "./read-json";

const constellationSchema = z.array(
  z.object({
    name: z.string(),
    coordinate: z.object({
      RA: z.number(),
      DEC: z.number(),
    }),
    radius: z.number(),
    edges: z.array(
      z.object({
        edge1: z.number(),
        edge2: z.number(),
      })
    ),
  })
);

(async () => {
  const path = "/home/alisyaifudin/Program/JS/rasli4/prisma/const.json";
  const constellations = readJson(path, constellationSchema);
  console.log(constellations);
  const lines = constellations.map((c) => {
    const edges = c.edges;
    return { name: c.name, edges };
  });
  console.log(lines);
})();
