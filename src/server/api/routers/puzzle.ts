import { random } from "~/utils/random";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { encryptString } from "~/utils/encryption";
import { env } from "~/env.mjs";
import { coneFilter } from "~/utils/coneFilter";
import readCsv from "~/utils/read-csv";
import { z } from "zod";
import { skyToXY } from "~/utils/skyToXY";
import path from "path";
import seedrandom from "seedrandom";

export const constellationSchema = z.object({
  name: z.string(),
  ra: z.string(),
  dec: z.string(),
  radius: z.string(),
});

export const starSchema = z.object({
  ra: z.string(),
  dec: z.string(),
  name: z.string().optional(),
  hd: z.string(),
  vmag: z.string(),
  bv: z.string().optional(),
  hex: z.string(),
});

export const lineSchema = z.object({
  ra1: z.string(),
  dec1: z.string(),
  ra2: z.string(),
  dec2: z.string(),
  name: z.string(),
});

export const puzzleRouter = createTRPCRouter({
  getPuzzle: publicProcedure
    .input(
      z.object({
        seed: z.string(),
        mode: z.enum(["comfy", "unlimited"]),
      })
    )
    .query(async ({ input }) => {
      const today = new Date();
      const date = today.toDateString();
      const seed =
        input.mode === "comfy" ? date : input.seed ?? Math.random().toString();
      const r = Math.round(random(seed) * 1000) % 89;

      // check the current path
      const currentPath = process.cwd();
      const rawConstellations = await readCsv(
        path.join(currentPath, "src/server/api/routers/constellations.csv"),
        ",",
        constellationSchema
      );
      const constellations = rawConstellations.map((c) => {
        const ra = Number(c.ra);
        const dec = Number(c.dec);
        const radius = Number(c.radius);
        if (isNaN(ra) || isNaN(dec) || isNaN(radius)) {
          throw new Error("Invalid constellation data\n" + JSON.stringify(c));
        }
        return {
          name: c.name,
          ra,
          dec,
          radius,
        };
      });
      const constellation = constellations[r];
      const encryptedName = encryptString(
        constellation.name,
        env.ENCRYPTION_KEY,
        seed
      );
      const rawStars = await readCsv(
        path.join(currentPath, "src/server/api/routers/stars.csv"),
        ",",
        starSchema
      );
      const stars = rawStars.map((star) => {
        const ra = Number(star.ra);
        const dec = Number(star.dec);
        if (isNaN(ra) || isNaN(dec)) {
          throw new Error("Invalid star data\n" + JSON.stringify(star));
        }
        return {
          ra,
          dec,
          vmag: star.vmag,
          hex: star.hex,
          hd: star.hd,
        };
      });
      const center = { ra: constellation.ra, dec: constellation.dec };

      const rotation = random(seed) * 2 * Math.PI;
      const inside = coneFilter(
        center,
        constellation.radius * 1.5,
        rotation,
        stars
      );
      const linesRaw = await readCsv(
        path.join(currentPath, "src/server/api/routers/lines.csv"),
        // "/home/alisyaifudin/Program/JS/rasli4/src/server/api/routers/constellations.csv",
        ",",
        lineSchema
      );
      const lines = linesRaw.map((line) => {
        const ra1 = Number(line.ra1);
        const dec1 = Number(line.dec1);
        const ra2 = Number(line.ra2);
        const dec2 = Number(line.dec2);
        if (isNaN(ra1) || isNaN(dec1) || isNaN(ra2) || isNaN(dec2)) {
          throw new Error("Invalid line data\n" + JSON.stringify(line));
        }
        const edge1 = skyToXY(center, rotation, { ra: ra1, dec: dec1 });
        const edge2 = skyToXY(center, rotation, { ra: ra2, dec: dec2 });
        return {
          edge1: {
            x: edge1.x,
            y: edge1.y,
          },
          edge2: {
            x: edge2.x,
            y: edge2.y,
          },
          in: line.name === constellation.name,
        };
      });
      return {
        name: encryptedName,
        stars: inside,
        radius: constellation.radius,
        lines: lines,
      };
    }),
});
