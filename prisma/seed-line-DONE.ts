import { z } from "zod";
import readJson from "./utils/read-json";
import { PrismaClient } from "@prisma/client";

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
  const prisma = new PrismaClient();
  const path = "/home/alisyaifudin/Program/JS/rasli4/prisma/const.json";
  const constellations = readJson(path, constellationSchema);
  console.log(constellations);
  const vanillaConstellation = constellations.map((c) => ({
    name: c.name,
    ra: c.coordinate.RA,
    dec: c.coordinate.DEC,
    radius: c.radius,
  }));
  const lines_raw = constellations.map((c) => {
    const edges = c.edges;
    return { name: c.name, edges };
  });
  for (const line of lines_raw) {
    const constellation = await prisma.constellation.findUnique({
      where: {
        name: line.name,
      },
    });
    if (!constellation) {
      throw new Error(`Constellation ${line.name} not found`);
    }
    const vanillaLines = line.edges.map((e) => ({
      constellationId: constellation.id,
      edge1: e.edge1,
      edge2: e.edge2,
    }));
    await prisma.line.createMany({
      data: vanillaLines,
    });
    console.log(
      `Created ${vanillaLines.length} lines for ${line.name} constellation`
    );
  }
  console.log("success");
})();
