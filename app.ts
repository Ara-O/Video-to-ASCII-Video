// const ffmpeg = require("ffmpeg");
// const videoshow = require("videoshow");
// const { exec } = require("child_process");
// import { Image } from "image-js";
// const fs = require("fs");
// const path = require("path");
import inquirer from "inquirer";
import ffmpeg from "ffmpeg";
import fs from "fs-extra";
import chalk from "chalk";

const log = console.log;
const ORIGINAL_VIDEO_FRAMES_PATH = "original_video_frames";
log(chalk.blueBright("Welcome to Video to ASCII Video!\n"));
log(chalk.white("Note: Use relative paths... Example -> ./duck.mp4\n"));

let prompts = [
  {
    type: "input",
    name: "Video path",
    filter(input) {
      return new Promise(async (resolve, reject) => {
        try {
          let sanitizedInput = input.replaceAll("'", "").replaceAll(`"`, "");

          if (!sanitizedInput.includes(".mp4")) {
            reject("Only accepts mp4 files are accepted");
          }
          resolve(sanitizedInput);
        } catch (err) {
          reject(err);
        }
      });
    },
  },
];

async function generateVideoFrames(videoData) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(ORIGINAL_VIDEO_FRAMES_PATH)) {
      fs.mkdirSync(ORIGINAL_VIDEO_FRAMES_PATH);
    } else {
      fs.emptyDirSync(ORIGINAL_VIDEO_FRAMES_PATH);
    }

    log(chalk.yellow("Extracting frames from video..."));
    videoData.fnExtractFrameToJPG(
      ORIGINAL_VIDEO_FRAMES_PATH,
      {
        frame_rate: 60,
        number: 300,
        file_name: "frame_%t_%s",
      },
      function (error, files) {
        if (error) {
          log(chalk.redBright(error.message));
          return reject();
        }
        log(chalk.green("Frames have been generated"));
        resolve("Success");
      }
    );
  });
}

// ACTUAL CODE STARTS HERE:

try {
  let userResponse = await inquirer.prompt(prompts);
  let videoPath = userResponse["Video path"];

  const videoData = await new ffmpeg(videoPath);

  await generateVideoFrames(videoData);
} catch (err) {
  log(chalk.redBright(err.msg || "Invalid input"));
}
// try {
// Clearing folders
// fs.readdir("./video-frames", (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join("./video-frames", file), (err) => {
//       if (err) throw err;
//     });
//   }
// });

// fs.readdir("./video-ascii-frames", (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join("./video-frames", file), (err) => {
//       if (err) throw err;
//     });
//   }
// });

//   let promisesArray: Promise<string>[] = [];

//   process.then(
//     function (video) {
//       video.fnExtractFrameToJPG(
//         "./video-frames",
//         {
//           frame_rate: 0.2,
//           number: 60,
//           file_name: "my_frame_%t_%s",
//         },
//         function (error, files) {
//           if (error) {
//             console.log(error);
//             return;
//           }

//           console.log("Frames have been generated");

//           for (let i = 0; i < files.length; i++) {
//             let file = files[i];
//             console.log(`File ${i} - ${file}`);
//             promisesArray.push(generateASCIITextFile(file));
//           }

//           Promise.all(promisesArray)
//             .then((res) => {
//               console.log(res);
//               generateASCIIVideo();
//             })
//             .catch((err) => {
//               console.log(err);
//             });
//         }
//       );
//     },
//     function (err) {
//       console.log("Error: " + err);
//     }
//   );
// } catch (e: any) {
//   console.log(e.code);
//   console.log(e.msg);
// }

// function generateASCIITextFile(file: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     Image.load(`./${file}`).then((img) => {
//       let resizedImg = img.resize({
//         height: 70,
//         preserveAspectRatio: true,
//       });

//       let videoFilePath = `./video-ascii-frames/${file
//         .replace("./video-frames", "")
//         .replace(".jpg", "")}.txt`;

//       // console.log(resizedImg);
//       for (let i = 0; i < resizedImg.data.length / 4; i++) {
//         let index = 4 * i;
//         let rVal = resizedImg.data[index + 1];
//         let gVal = resizedImg.data[index + 2];
//         let bVal = resizedImg.data[index + 3];
//         let aVal = resizedImg.data[index + 4];

//         let average = (rVal + gVal + bVal + aVal) / 4;
//         if (average >= 235) {
//           fs.appendFileSync(videoFilePath, ".");
//         } else if (average >= 200) {
//           fs.appendFileSync(videoFilePath, "@");
//         } else {
//           fs.appendFileSync(videoFilePath, "#");
//         }

//         if (i !== 0 && i % resizedImg.width === 0) {
//           fs.appendFileSync(videoFilePath, "\r\n");
//         }
//       }

//       resolve(videoFilePath);

//       // resizedImg.save("test.png");
//     });
//   });
// }

// function generateASCIIVideo() {
//   //Reading file directory
//   fs.readdir("./video-ascii-frames", (err, files) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     const executeCommands = (commands: String[]) => {
//       console.log("Commands", commands);
//       if (commands.length === 0) {
//         console.log("All frames generated");
//         // const concatCommand = `ffmpeg -framerate 7 -i ./video-image-frames/image_%04d.png -c:v libx264 -vf "fps=7" test.mp4`;
//         // exec(concatCommand, (error: any) => {
//         //   if (error) {
//         //     console.error("Error concatenating frames to video:", error);
//         //   } else {
//         //     console.log(`Video saved, pls work`);
//         //   }
//         // });
//         return;
//       }

//       const command = commands.shift();
//       console.log("Command being executed now", command);
//       exec(command, (error: any, stdout: any, stderr: any) => {
//         if (error) {
//           console.log("error");
//           fs.writeFileSync("error.txt", error.message);
//           // console.error(`Error generating frame`, error);
//           return;
//         }

//         if (stderr) {
//           // console.error(`FFmpeg stderr: ${stderr}`);
//           // return;
//         }

//         console.log(`Frame generated`);
//         executeCommands(commands);
//       });
//     };

//     //Parsing file text
//     const commands: String[] = [];
//     files.forEach((file, index) => {
//       const textFilePath = `./video-ascii-frames/${file}`;
//       const frameFileName = `./video-ascii-frames/${file.replace(
//         ".txt",
//         ".png"
//       )}`;

//       // fs.writeFileSync("temp.txt", textContent)
//       // ffmpeg -f lavfi -i color=c=black:s=1280x720 -vf "drawtext=fontfile="./font.TTF":text='OpenAI GPT-3.5':fontsize=24:fontcolor=white:x=(w-tw)/2:y=(h-th)/2" -vframes 1 test.png
//       const command = `ffmpeg -f lavfi -i color=c=black:s=1280x1520 -vf "drawtext=fontfile="./fonts/consola.ttf":textfile='${textFilePath}':x=(w-tw)/2:y=(h-th)/2:fontsize=24:fontcolor=white" -vframes 1 ./video-image-frames/image_${String(
//         index
//       ).padStart(4, "0")}.png`;

//       // Add the command to the array
//       commands.push(command);

//       if (index === files.length - 1) {
//         console.log("Executing commands now");
//         executeCommands(commands);
//       }
//     });
//   });
// }

// generateASCIIVideo();

// Use https://github.com/h2non/videoshow to make video
