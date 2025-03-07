const fs = require('fs');
const readline = require('readline');

const now = new Date();

exports.countRequestsInLastHour = async (logFilePath) => {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Waktu satu jam yang lalu
    const requestCount = {};

    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    try {
        for await (const line of rl) {
            const match = line.match(/\[(.*?)\] (GET|POST|PUT|DELETE) (\S+) \d+/);
            if (!match) continue;
    
            const logTime = new Date(match[1]);
            const endpoint = match[3];
            if (logTime >= oneHourAgo && logTime <= now) {
                requestCount[endpoint] = (requestCount[endpoint] || 0) + 1;
            }
        }
        return requestCount;
    } catch (error) {
        throw new Error("Masukkan file path dengan benar!")
    }
}
