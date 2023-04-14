import { exec } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";

(function main() {
  const errors = [];

  const [, , inputArg, outputArg] = process.argv;

  if (!inputArg) {
    console.error("Missing mp3 directory argument");
  }
  if (!outputArg) {
    console.error("Missing output directory argument");
  }

  if (!inputArg || !outputArg) {
    console.log("\nUsage: npm start <Mp3 directory> <output directory>\n");
    return;
  }

  // check if input folder exists, throw error if not
  const inputDirExists = fs.existsSync(path.resolve(inputArg));
  if (!inputDirExists) {
    return console.error(
      `Error: No folder found at ${path.resolve(inputArg)}\n`
    );
  }

  // store array of each file in input mp3 folder
  const mp3Files = fs.readdirSync(path.resolve(inputArg));

  // throw error if no files exist in folder
  if (!mp3Files.length) {
    return console.error(
      `Error: No files exist in folder: ${path.resolve(inputArg)}\n`
    );
  }

  // check if output folder exists, and creates the folder if it doesn't
  const outputDirExists = fs.existsSync(path.resolve(outputArg));
  if (!outputDirExists) {
    fs.mkdirSync(path.resolve(outputArg));
    console.log(`created folder at ${path.resolve(outputArg)}\n`);
  }

  // for each file in input folder, copy it to the output folder, renaming the extension to .mov
  for (let file of mp3Files) {
    let newFilename = file.split(".")[0] + ".mov";

    fs.copyFile(
      path.resolve(inputArg, file),
      path.resolve(outputArg, newFilename),
      (err) => {
        if (err) {
          errors.push(err);
        }
      }
    );
  }

  if (errors.length) {
    errors.forEach(console.error);
    return;
  }

  console.log("Success!\n");

  // open output folder with new files in Finder
  exec(`open ${path.resolve(outputArg)}`);
})();
