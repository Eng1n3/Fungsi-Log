const { countRequestsInLastHour } = require("./readlog");

const logFilePath = "server.log";

countRequestsInLastHour(logFilePath)
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
