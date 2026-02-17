import { z } from "zod";

const idSchema = z.string().min(1);

const pagingQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().optional()
});

const workspaceBodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  memberIds: z.array(z.string().min(1)).max(100).optional()
});

const workspaceUpdateSchema = workspaceBodySchema.partial();

const workspaceCreateSchema = z.object({
  body: workspaceBodySchema,
  params: z.object({}),
  query: z.object({})
});

const workspaceUpdateRequestSchema = z.object({
  body: workspaceUpdateSchema,
  params: z.object({ workspaceId: idSchema }),
  query: z.object({})
});

const workspaceIdSchema = z.object({
  body: z.object({}),
  params: z.object({ workspaceId: idSchema }),
  query: z.object({})
});

const workspaceListSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: pagingQuerySchema
});

export {
  workspaceCreateSchema,
  workspaceIdSchema,
  workspaceListSchema,
  workspaceUpdateRequestSchema
};
