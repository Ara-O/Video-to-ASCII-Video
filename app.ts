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
import Jimp from "jimp";

const log = console.log;
const ASCII_CHARS: string = "@%0*+#-#  ";
const ORIGINAL_VIDEO_FRAMES_PATH: string = "original_video_frames";
const ASCII_TXT_REPRESENTATION_PATH = "ascii_video_frames";
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
        // number: 300,
        number: 10,
        file_name: "frame_%t_%s",
      },
      function (error, files) {
        if (error) {
          log(chalk.redBright(error.message));
          return reject();
        }
        log(chalk.green("Frames have been generated"));
        resolve(files);
      }
    );
  });
}

// ACTUAL CODE STARTS HERE:

try {
  let userResponse = await inquirer.prompt(prompts);
  let videoPath = userResponse["Video path"];

  const videoData = await new ffmpeg(videoPath);

  const allGeneratedFiles = (await generateVideoFrames(videoData)) as string[];

  log(chalk.yellowBright("\nGenerating text files..."));

  fs.access(`${ASCII_TXT_REPRESENTATION_PATH}`, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(ASCII_TXT_REPRESENTATION_PATH);
    } else {
      fs.emptyDirSync(ASCII_TXT_REPRESENTATION_PATH);
    }
  });

  let generateNecessaryFiles = allGeneratedFiles.map(async (file, index) => {
    let imageData = await Jimp.read(file);
    imageData.resize(50, Jimp.AUTO);
    let asciiArt = "";
    for (let y = 0; y < imageData.getHeight(); y++) {
      for (let x = 0; x < imageData.getWidth(); x++) {
        const pixel = Jimp.intToRGBA(imageData.getPixelColor(x, y));
        const brightness = (pixel.r + pixel.g + pixel.b) / 3;
        const charIndex = Math.floor(
          (brightness / 255) * (ASCII_CHARS.length - 1)
        );

        const char = ASCII_CHARS[charIndex];

        asciiArt += char;
      }
      asciiArt += "\n";
    }

    return fs.writeFile(
      `${ASCII_TXT_REPRESENTATION_PATH}/frame-${index}.txt`,
      asciiArt
    );
  });

  await Promise.all(generateNecessaryFiles);
  log(chalk.greenBright("Text files have been generated"));

  const allTextFiles = fs.readdirSync(ASCII_TXT_REPRESENTATION_PATH);
  let allFrames: string[] = [];
  allTextFiles.forEach((file) => {
    allFrames.push(
      fs.readFileSync(`${ASCII_TXT_REPRESENTATION_PATH}/${file}`, "utf8")
    );
  });

  let currentFrame = 0;
  console.log(allFrames);

  // function spinnerAnimation() {
  //   let currentFrame = 0;

  //   setInterval(() => {
  //     process.stdout.write(`\r${allFrames[currentFrame]}  `);
  //     currentFrame = (currentFrame + 1) % allFrames.length;
  //   }, 40);
  // }
  // spinnerAnimation();
} catch (err) {
  log(chalk.redBright(err));
}

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
