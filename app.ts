import ffmpeg from "ffmpeg";
const videoshow = require("videoshow");
import { Image } from "image-js";
const { exec } = require("child_process");
import fs, { readFileSync } from "fs";
import path from "path";

try {
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

  let promisesArray: Promise<string>[] = [];
  var process = new ffmpeg("./duck.mp4");

  process.then(
    function (video) {
      video.fnExtractFrameToJPG(
        "./video-frames",
        {
          frame_rate: 0.2,
          number: 60,
          file_name: "my_frame_%t_%s",
        },
        function (error, files) {
          if (error) {
            console.log(error);
            return;
          }

          console.log("Frames have been generated");

          for (let i = 0; i < files.length; i++) {
            let file = files[i];
            console.log(`File ${i} - ${file}`);
            promisesArray.push(generateASCIITextFile(file));
          }

          Promise.all(promisesArray)
            .then((res) => {
              console.log(res);
              generateASCIIVideo();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    },
    function (err) {
      console.log("Error: " + err);
    }
  );
} catch (e: any) {
  console.log(e.code);
  console.log(e.msg);
}

function generateASCIITextFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Image.load(`./${file}`).then((img) => {
      let resizedImg = img.resize({
        height: 70,
        preserveAspectRatio: true,
      });

      let videoFilePath = `./video-ascii-frames/${file
        .replace("./video-frames", "")
        .replace(".jpg", "")}.txt`;

      // console.log(resizedImg);
      for (let i = 0; i < resizedImg.data.length / 4; i++) {
        let index = 4 * i;
        let rVal = resizedImg.data[index + 1];
        let gVal = resizedImg.data[index + 2];
        let bVal = resizedImg.data[index + 3];
        let aVal = resizedImg.data[index + 4];

        let average = (rVal + gVal + bVal + aVal) / 4;
        if (average >= 235) {
          fs.appendFileSync(videoFilePath, ".");
        } else if (average >= 200) {
          fs.appendFileSync(videoFilePath, "@");
        } else {
          fs.appendFileSync(videoFilePath, "#");
        }

        if (i !== 0 && i % resizedImg.width === 0) {
          fs.appendFileSync(videoFilePath, "\r\n");
        }
      }

      resolve(videoFilePath);

      // resizedImg.save("test.png");
    });
  });
}

function generateASCIIVideo() {
  //Reading file directory
  fs.readdir("./video-ascii-frames", (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const executeCommands = (commands: String[]) => {
      console.log("Commands", commands);
      if (commands.length === 0) {
        console.log("All frames generated");
        // const concatCommand = `ffmpeg -framerate 7 -i ./video-image-frames/image_%04d.png -c:v libx264 -vf "fps=7" test.mp4`;
        // exec(concatCommand, (error: any) => {
        //   if (error) {
        //     console.error("Error concatenating frames to video:", error);
        //   } else {
        //     console.log(`Video saved, pls work`);
        //   }
        // });
        return;
      }

      const command = commands.shift();
      console.log("Command being executed now", command);
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log("error");
          fs.writeFileSync("error.txt", error.message);
          // console.error(`Error generating frame`, error);
          return;
        }

        if (stderr) {
          // console.error(`FFmpeg stderr: ${stderr}`);
          // return;
        }

        console.log(`Frame generated`);
        executeCommands(commands);
      });
    };

    //Parsing file text
    const commands: String[] = [];
    files.forEach((file, index) => {
      const textFilePath = `./video-ascii-frames/${file}`;
      const frameFileName = `./video-ascii-frames/${file.replace(
        ".txt",
        ".png"
      )}`;

      // fs.writeFileSync("temp.txt", textContent)
      // ffmpeg -f lavfi -i color=c=black:s=1280x720 -vf "drawtext=fontfile="./font.TTF":text='OpenAI GPT-3.5':fontsize=24:fontcolor=white:x=(w-tw)/2:y=(h-th)/2" -vframes 1 test.png
      const command = `ffmpeg -f lavfi -i color=c=black:s=1280x1520 -vf "drawtext=fontfile="./fonts/consola.ttf":textfile='${textFilePath}':x=(w-tw)/2:y=(h-th)/2:fontsize=24:fontcolor=white" -vframes 1 ./video-image-frames/image_${String(
        index
      ).padStart(4, "0")}.png`;

      // Add the command to the array
      commands.push(command);

      if (index === files.length - 1) {
        console.log("Executing commands now");
        executeCommands(commands);
      }
    });
  });
}

generateASCIIVideo();

// Use https://github.com/h2non/videoshow to make video
