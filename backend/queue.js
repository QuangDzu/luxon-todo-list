require("dotenv").config();

require("./src/config/database");

const tasks = require("./src/tasks");

const constants = require("./src/config/constants");
const queueModel = require("./src/models/queue.model");
const sleep = require("./src/utils/sleep");

(async () => {
  while (true) {
    //
    const pendingJob = await queueModel.findOnePending();
    if (pendingJob) {
      const type = pendingJob.type;
      const payload = JSON.parse(pendingJob.payload);

      switch (type) {
        case "sendVerifyEmail":
          try {
            console.log(`Job: ${type} is processing...`);

            await queueModel.updateStatus(
              pendingJob.id,
              constants.QUEUES_STATUS.INPROGRESS,
            );
            console.log(2);

            const handler = tasks[type];
            if (!handler) {
              throw new Error(`Không có task xử lý cho: ${type}`);
            }
            await handler(payload);

            await queueModel.updateStatus(
              pendingJob.id,
              constants.QUEUES_STATUS.COMPLETED,
            );

            console.log(`Job: ${type} is processed.`);
          } catch (error) {
            console.log(5);
            console.error("Job failed:", error);
            await queueModel.updateStatus(
              pendingJob.id,
              constants.QUEUES_STATUS.FAILED,
            );
            console.log(6);
          }
      }
    }

    await sleep(1000);
  }
})();
