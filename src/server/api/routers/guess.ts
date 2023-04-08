import { z } from "zod";
import { env } from "~/env.mjs";
import { decryptString } from "~/utils/encryption";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .mutation(async ({ input, ctx }) => {
      // transform guess to capitalize each first letter words
      const today = new Date();
      const date = today.toDateString();
      const seed = input.seed ?? date;
      const guessTransform = capitalizeWords(input.guess);
      const findConstellation = await ctx.prisma.constellation.findUnique({
        where: { name: guessTransform },
      });
      if (!findConstellation) {
        return {
          correct: false,
          message: "Rasi tidak ada",
          code: "NOT_FOUND",
        };
      }
      const mysteryConstellation = decryptString(
        input.puzzle,
        env.ENCRYPTION_KEY,
        seed
      );
      if (mysteryConstellation === guessTransform) {
        return {
          correct: true,
          message: mysteryConstellation,
          code: "CORRECT",
        };
      }
      return {
        correct: false,
        message: "Rasi tidak cocok",
        code: "INCORRECT",
      };
    }),
});
