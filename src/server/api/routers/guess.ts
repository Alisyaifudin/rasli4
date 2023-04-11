import { z } from "zod";
import { env } from "~/env.mjs";
import { decryptString } from "~/utils/encryption";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import readCsv from "~/utils/read-csv";
import path from "path";
import { constellationSchema } from "./puzzle";
import { distance } from "~/utils/distance";

function capitalizeWords(str: string) {
  return str.toLowerCase().replace(/(^|\s)\S/g, function (firstLetter) {
    return firstLetter.toUpperCase();
  });
}

export const guessRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        puzzle: z.string(),
        guess: z.string(),
        seed: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // transform guess to capitalize each first letter words
      const guessTransform = input.guess.toLowerCase();
      const currentPath = process.cwd();
      const constellations = await readCsv(
        path.join(currentPath, "src/server/api/routers/constellations.csv"),
        ",",
        constellationSchema
      );
      const findConstellation = constellations.find(
        (c) => c.name.toLowerCase() === guessTransform
      );
      if (!findConstellation) {
        return {
          correct: false,
          message: "Rasi tidak ada",
          code: "NOT_FOUND",
          closeness: 99,
        };
      }
      const mysteryConstellation = decryptString(
        input.puzzle,
        env.ENCRYPTION_KEY
      );
      const theMysteryConstellation = constellations.find(
        (c) => c.name.toLowerCase() === mysteryConstellation.toLowerCase()
      );
      if (!theMysteryConstellation) {
        throw new Error("Mystery constellation not found");
      }
      const dist = distance(
        {
          ra: Number(theMysteryConstellation.ra),
          dec: Number(theMysteryConstellation.dec),
        },
        {
          ra: Number(findConstellation.ra),
          dec: Number(findConstellation.dec),
        }
      );
      const closeness = Math.floor(
        dist / Number(theMysteryConstellation.radius)
      );
      if (mysteryConstellation.toLowerCase() === guessTransform) {
        return {
          correct: true,
          message: mysteryConstellation,
          code: "CORRECT",
          closeness,
        };
      }
      return {
        correct: false,
        message: mysteryConstellation,
        code: "INCORRECT",
        closeness,
      };
    }),
});
