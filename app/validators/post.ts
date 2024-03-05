import { z } from 'zod'

export const postValidator = {
  create: z.object({
    content: z.string().min(1).max(144),
  }),
  update: z.object({
    content: z.string().min(1).max(144),
  }),
  delete: z.object({
    postId: z.string(),
  }),
}
