const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ClickUp-Style Task Manager API",
    version: "1.0.0",
    description:
      "REST API for workspaces, lists, and tasks using Firebase Firestore and Firebase Auth."
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Workspaces" },
    { name: "Lists" },
    { name: "Tasks" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Firebase ID token"
      }
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Validation failed" }
        }
      },
      Workspace: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          ownerId: { type: "string" },
          members: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", nullable: true },
          updatedAt: { type: "string", nullable: true }
        }
      },
      List: {
        type: "object",
        properties: {
          id: { type: "string" },
          workspaceId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          statuses: { type: "array", items: { type: "string" } },
          position: { type: "integer" },
          createdBy: { type: "string" },
          createdAt: { type: "string", nullable: true },
          updatedAt: { type: "string", nullable: true }
        }
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          workspaceId: { type: "string" },
          listId: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string" },
          priority: { type: "string", enum: ["low", "normal", "high", "urgent"] },
          dueDate: { type: "string", nullable: true },
          startDate: { type: "string", nullable: true },
          assigneeIds: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          estimateMinutes: { type: "integer", nullable: true },
          parentTaskId: { type: "string", nullable: true },
          archived: { type: "boolean" },
          createdBy: { type: "string" },
          updatedBy: { type: "string" },
          createdAt: { type: "string", nullable: true },
          updatedAt: { type: "string", nullable: true }
        }
      },
      CreateWorkspaceRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Product Team" },
          description: { type: "string", example: "Q1 execution" },
          memberIds: { type: "array", items: { type: "string" }, example: ["uid_2", "uid_3"] }
        }
      },
      UpdateWorkspaceRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          memberIds: { type: "array", items: { type: "string" } }
        }
      },
      CreateListRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Sprint Backlog" },
          description: { type: "string", example: "Current sprint" },
          position: { type: "integer", example: 1 },
          statuses: {
            type: "array",
            items: { type: "string" },
            example: ["todo", "in-progress", "review", "done"]
          }
        }
      },
      UpdateListRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          position: { type: "integer" },
          statuses: { type: "array", items: { type: "string" } }
        }
      },
      CreateTaskRequest: {
        type: "object",
        required: ["listId", "title"],
        properties: {
          listId: { type: "string", example: "LIST_ID" },
          title: { type: "string", example: "Implement notifications" },
          description: { type: "string", example: "Email and in-app alerts" },
          status: { type: "string", example: "todo" },
          priority: { type: "string", enum: ["low", "normal", "high", "urgent"], example: "high" },
          dueDate: { type: "string", format: "date-time", example: "2026-03-10T12:00:00.000Z" },
          startDate: { type: "string", format: "date-time", example: "2026-03-01T09:00:00.000Z" },
          assigneeIds: { type: "array", items: { type: "string" }, example: ["uid_2"] },
          tags: { type: "array", items: { type: "string" }, example: ["backend", "v1"] },
          estimateMinutes: { type: "integer", example: 180 },
          parentTaskId: { type: "string", example: "TASK_PARENT_ID" }
        }
      },
      UpdateTaskRequest: {
        type: "object",
        properties: {
          listId: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string" },
          priority: { type: "string", enum: ["low", "normal", "high", "urgent"] },
          dueDate: { type: "string", format: "date-time" },
          startDate: { type: "string", format: "date-time" },
          assigneeIds: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          estimateMinutes: { type: "integer" },
          parentTaskId: { type: "string" },
          archived: { type: "boolean" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "API health check",
        responses: {
          200: {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/workspaces": {
      get: {
        tags: ["Workspaces"],
        summary: "List workspaces visible to current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Workspace list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Workspace" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Workspaces"],
        summary: "Create workspace",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateWorkspaceRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "Workspace created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Workspace" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/workspaces/{workspaceId}": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspace by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Workspace",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Workspace" }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ["Workspaces"],
        summary: "Update workspace (owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateWorkspaceRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Workspace updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Workspace" }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Workspaces"],
        summary: "Delete workspace (owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          204: { description: "Deleted" }
        }
      }
    },
    "/workspaces/{workspaceId}/lists": {
      get: {
        tags: ["Lists"],
        summary: "List lists for workspace",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Lists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/List" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Lists"],
        summary: "Create list in workspace",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateListRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "List created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/List" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/workspaces/{workspaceId}/lists/{listId}": {
      patch: {
        tags: ["Lists"],
        summary: "Update list",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "listId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateListRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "List updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/List" }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Lists"],
        summary: "Delete list",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "listId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          204: { description: "Deleted" }
        }
      }
    },
    "/workspaces/{workspaceId}/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List tasks with filters",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "listId", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "assigneeId", in: "query", schema: { type: "string" } },
          { name: "archived", in: "query", schema: { type: "boolean" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } }
        ],
        responses: {
          200: {
            description: "Task list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Task" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Create task",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "Task created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/workspaces/{workspaceId}/tasks/{taskId}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Task",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update task",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Task updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          204: { description: "Deleted" }
        }
      }
    }
  }
};

export default openApiSpec;
