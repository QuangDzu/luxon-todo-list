const { spawn, execSync } = require("child_process");
const fs = require("fs");
const emailService = require("../src/services/email.service");
// mysqldump -uroot -pdung5699 -P3306 blog_dev > blog_dev-2026-03-24.sql
function backupDB() {
  const outputFile = `./backup/blog_dev-${new Date().toISOString().split("T")[0]}.sql`;

  const outputStream = fs.createWriteStream(outputFile);

  const mysqldump = spawn("mysqldump", [
    `-uroot`,
    `-pdung5699`,
    `-P3306`,
    `blog_dev`,
  ]);

  mysqldump.stdout.pipe(outputStream);

  mysqldump.on("error", (error) => {
    outputStream.end();
    console.log(`mysqldump error: ${error.message}`);
  });

  mysqldump.on("close", async (code) => {
    outputStream.end();
    console.log(`child process exited with code ${code}`);

    if (code === 0) {
      console.log(`✅ Backup thành công! File: ${outputFile}`);
      execSync(`rclone sync ./backup F8BlogDrive:backupdb`);
      console.log(`Upload Drive successfully!`);

      await emailService.sendBackupReport(
        "nguyenquangdzuu@gmail.com",
        "Backup thành công",
        outputFile,
      );

      console.log(`Send email report successfully!`);
    } else {
      fs.unlinkSync(outputFile);
    }
  });
}

module.exports = backupDB;
