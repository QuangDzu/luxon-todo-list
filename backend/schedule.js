require("dotenv").config();
require("./src/config/database");

const { CronJob } = require("cron");

const dailyReport = require("./schedules/dailyReport");
const backupDB = require("./schedules/backupDB");

new CronJob("0 2 * * *", dailyReport, null, true);
new CronJob("*/5 * * * * *", backupDB, null, true);
