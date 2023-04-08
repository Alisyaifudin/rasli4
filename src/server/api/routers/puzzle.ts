import { z } from "zod";
import { random } from "~/utils/random";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { encryptString } from "~/utils/encryption";
import { env } from "~/env.mjs";

export const puzzleRouter = createTRPCRouter({
  getDailyPuzzle: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const date = today.toDateString();
    const r = Math.round(random(date) * 89);
    const constellations = await ctx.prisma.constellation.findMany({
      select: {
        name: true,
        dec: true,
        ra: true,
        radius: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    const constellation = constellations[r];
    console.log("=====================");
    console.log(constellation.name);
    console.log("=====================");
    const encryptedName = encryptString(
      constellation.name,
      env.ENCRYPTION_KEY,
      date
    );
    return {
      name: encryptedName,
    };
  }),
  getPuzzle: publicProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      const seed = input ?? Math.random().toString();
      if (seed === "0") {
        return {
          name: null,
        };
      }
      const r = Math.round(random(seed) * 89);
      const constellations = await ctx.prisma.constellation.findMany({
        select: {
          name: true,
          dec: true,
          ra: true,
          radius: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      const constellation = constellations[r];
      console.log("=====================");
      console.log(constellation.name);
      console.log("=====================");
      const encryptedName = encryptString(
        constellation.name,
        env.ENCRYPTION_KEY,
        seed
      );
      return {
        name: encryptedName,
      };
    }),
});
