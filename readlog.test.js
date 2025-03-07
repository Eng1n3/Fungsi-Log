const fs = require("fs");
const { countRequestsInLastHour } = require("./readlog");

describe("countRequestsInLastHour", () => {
  const logFilePath = "test.log";

  beforeAll(() => {
    const mockLogData = `
        [2025-03-07 11:00:01] GET /api/users 200
        [2025-03-07 11:15:45] POST /api/login 201
        [2025-03-07 11:55:02] GET /api/users 200
        [2025-03-07 11:05:00] GET /api/orders 404
        `;
    fs.writeFileSync(logFilePath, mockLogData);
  });

  afterAll(() => {
    fs.unlinkSync(logFilePath); // Hapus file setelah pengujian selesai
  });

  test("menghitung jumlah request dalam 1 jam terakhir", async () => {
    // Mock Date agar new Date() selalu mengembalikan waktu tertentu
    jest.useFakeTimers().setSystemTime(new Date("2025-03-07T04:06:34.315Z"));

    const result = await countRequestsInLastHour(logFilePath);
    expect(result).toEqual({ "/api/users": 1, "/api/orders": 1 });

    jest.useRealTimers(); // Kembalikan waktu asli setelah test selesai
  });

  test("menghitung jumlah request dalam 1 jam terakhir", async () => {
    // Mock Date agar new Date() selalu mengembalikan waktu tertentu
    jest.useFakeTimers().setSystemTime(new Date("2025-03-07T04:06:34.315Z"));

    try {
      await countRequestsInLastHour("dummy.log");
    } catch (error) {
      expect(error.message).toMatch("Masukkan file path dengan benar!");
    }

    jest.useRealTimers(); // Kembalikan waktu asli setelah test selesai
  });
});
