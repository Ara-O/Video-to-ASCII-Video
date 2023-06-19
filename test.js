const { execSync } = require("child_process");

const textFilePath =
  "./video-ascii-frames/my_frame_1687183668986_640x360_1.jpg.txt";
const frameFileName = "test.png";
const command = `ffmpeg -f lavfi -i color=c=black:s=1280x1520 -vf "drawtext=fontfile="./fonts/consola.ttf":textfile='${textFilePath}':x=(w-tw)/2:y=(h-th)/2:fontsize=24:fontcolor=white" -vframes 1 ${frameFileName}`;

execSync(command);
