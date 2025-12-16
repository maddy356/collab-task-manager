import { jest } from "@jest/globals";

/**
 * ✅ ESM-safe mocking:
 * - Use unstable_mockModule()
 * - Then dynamically import modules AFTER mocking
 */

const taskRepoMock = {
  create: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn()
};

const notificationRepoMock = {
  create: jest.fn()
};

await jest.unstable_mockModule("../repositories/task.repo.js", () => ({
  taskRepo: taskRepoMock
}));

await jest.unstable_mockModule("../repositories/notification.repo.js", () => ({
  notificationRepo: notificationRepoMock
}));

// ✅ Import AFTER mocks so the mocked versions are used
const { taskService } = await import("./task.service.js");
const { taskRepo } = await import("../repositories/task.repo.js");
const { notificationRepo } = await import("../repositories/notification.repo.js");

function makeIoMock() {
  return {
    emit: jest.fn(),
    to: jest.fn().mockReturnValue({ emit: jest.fn() })
  } as any;
}

describe("taskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTask emits tasks:changed and creates notification", async () => {
    const io = makeIoMock();

    (taskRepo.create as any).mockResolvedValue({
      _id: "t1",
      title: "Test task",
      assignedToId: "u2"
    });

    (notificationRepo.create as any).mockResolvedValue({});

    await taskService.createTask(io, "u1", {
      title: "Test task",
      description: "",
      dueDate: new Date().toISOString(),
      priority: "Low",
      status: "To Do",
      assignedToId: "u2"
    });

    expect(io.emit).toHaveBeenCalledWith("tasks:changed", expect.any(Object));
    expect(notificationRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u2" })
    );
  });

  test("updateTask throws 404 if task not found", async () => {
    const io = makeIoMock();

    (taskRepo.findById as any).mockResolvedValue(null);

    await expect(
      taskService.updateTask(io, "missing", { status: "Completed" })
    ).rejects.toMatchObject({ status: 404 });
  });

  test("updateTask notifies when assignedToId changes", async () => {
    const io = makeIoMock();

    (taskRepo.findById as any).mockResolvedValue({ assignedToId: "oldUser" });
    (taskRepo.updateById as any).mockResolvedValue({ title: "X" });
    (notificationRepo.create as any).mockResolvedValue({});

    await taskService.updateTask(io, "t1", { assignedToId: "newUser" });

    expect(notificationRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "newUser" })
    );
  });
});
