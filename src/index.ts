import { exec } from "child_process";
import fs from "node:fs";

fs.readFileSync(process.argv[process.argv.length - 2], "utf8");

const target = process.argv[process.argv.length - 1];

exec(`cargo run -r --target ${target}`, function (error, stdout, stderr) {
	if (stderr) {
		console.error(stderr);
	}
	if (error !== null) {
		console.error(error);
	}
	console.log(stdout);
	console.log("Done!");
});
