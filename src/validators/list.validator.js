import { z } from "zod";

const idSchema = z.string().min(1);

const listBodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  position: z.number().int().min(0).optional(),
  statuses: z.array(z.string().min(1).max(60)).max(20).optional()
});

const listUpdateSchema = listBodySchema.partial();

const listCreateSchema = z.object({
  body: listBodySchema,
  params: z.object({ workspaceId: idSchema }),
  query: z.object({})
});

const listUpdateRequestSchema = z.object({
  body: listUpdateSchema,
  params: z.object({ workspaceId: idSchema, listId: idSchema }),
  query: z.object({})
});

const listIdSchema = z.object({
  body: z.object({}),
  params: z.object({ workspaceId: idSchema, listId: idSchema }),
  query: z.object({})
});

const listByWorkspaceSchema = z.object({
  body: z.object({}),
  params: z.object({ workspaceId: idSchema }),
  query: z.object({})
});

export { listByWorkspaceSchema, listCreateSchema, listIdSchema, listUpdateRequestSchema };
