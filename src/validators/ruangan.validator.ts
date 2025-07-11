import { z } from "zod";

export const postRuanganSchema = z.object({
  nama: z.string(),
});
