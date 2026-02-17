import { z } from "zod";

const idSchema = z.string().min(1);

const taskBodySchema = z.object({
  listId: idSchema,
  title: z.string().min(2).max(180),
  description: z.string().max(5000).optional(),
  status: z.string().min(1).max(60).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  assigneeIds: z.array(z.string().min(1)).max(50).optional(),
  tags: z.array(z.string().min(1).max(60)).max(40).optional(),
  estimateMinutes: z.number().int().min(0).optional(),
  parentTaskId: z.string().min(1).optional()
});

const taskUpdateSchema = taskBodySchema.partial().extend({
  archived: z.boolean().optional()
});

const taskCreateSchema = z.object({
  body: taskBodySchema,
  params: z.object({ workspaceId: idSchema }),
  query: z.object({})
});

const taskUpdateRequestSchema = z.object({
  body: taskUpdateSchema,
  params: z.object({ workspaceId: idSchema, taskId: idSchema }),
  query: z.object({})
});

const taskIdSchema = z.object({
  body: z.object({}),
  params: z.object({ workspaceId: idSchema, taskId: idSchema }),
  query: z.object({})
});

const taskListSchema = z.object({
  body: z.object({}),
  params: z.object({ workspaceId: idSchema }),
  query: z.object({
    listId: z.string().optional(),
    status: z.string().optional(),
    assigneeId: z.string().optional(),
    archived: z.coerce.boolean().optional(),
    search: z.string().max(180).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional()
  })
});

export { taskCreateSchema, taskIdSchema, taskListSchema, taskUpdateRequestSchema };
