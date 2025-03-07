const fs = require("fs");
const { countRequestsInLastHour } = require("./readlog");

describe("countRequestsInLastHour", () => {
  const logFilePath = "test.log";

  beforeAll(() => {
    const mockLogData = `
        [2024-10-22 15:00:01] GET /api/users 200
        [2024-10-22 15:15:45] POST /api/login 201
        [2024-10-22 15:55:02] GET /api/users 200
        [2024-10-22 16:05:00] GET /api/orders 404
        `;
    fs.writeFileSync(logFilePath, mockLogData);
  });

  afterAll(() => {
    fs.unlinkSync(logFilePath); // Hapus file setelah pengujian selesai
  });

  test("menghitung jumlah request dalam 1 jam terakhir", async () => {
    // Mock Date agar new Date() selalu mengembalikan waktu tertentu
    jest.useFakeTimers().setSystemTime(new Date("2024-10-22T10:00:00Z"));

    const result = await countRequestsInLastHour(logFilePath);
    expect(result).toEqual({ "/api/orders": 1 });

    jest.useRealTimers(); // Kembalikan waktu asli setelah test selesai
  });

  test("error test ketika tidak ada file", async () => {
    // Mock Date agar new Date() selalu mengembalikan waktu tertentu

    try {
      await countRequestsInLastHour("dummy.log");
    } catch (error) {
      expect(error.message).toMatch("Masukkan file path dengan benar!");
    }
  });

  test("menghitung jumlah request lebih dari 1 jam", async () => {
    // Mock Date agar new Date() selalu mengembalikan waktu tertentu
    jest.useFakeTimers().setSystemTime(new Date("2024-10-22T12:00:00Z"));

    const result = await countRequestsInLastHour(logFilePath);
    expect(result).toEqual({});

    jest.useRealTimers(); // Kembalikan waktu asli setelah test selesai
  });
});
