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
  await prisma.constellation.createMany({
    data: vanillaConstellation,
  });
  console.log("success");
})();
