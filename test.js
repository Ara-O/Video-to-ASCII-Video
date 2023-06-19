const videoshow = require("videoshow");
const fs = require("fs");

let images = fs.readdirSync("video-image-frames");
images = images.map((img) => `./video-image-frames/${img}`);

var videoOptions = {
  fps: 15,
  loop: 0.1, // seconds
  transition: false,
  videoBitrate: 1024,
  videoCodec: "libx264",
  size: "640x?",
  audioBitrate: "128k",
  audioChannels: 2,
  format: "mp4",
  pixelFormat: "yuv420p",
};
videoshow(images, videoOptions)
  .save("video.mp4")
  .on("start", function (command) {
    console.log("ffmpeg process started:", command);
  })
  .on("error", function (err, stdout, stderr) {
    console.error("Error:", err);
    console.error("ffmpeg stderr:", stderr);
  })
  .on("end", function (output) {
    console.error("Video created in:", output);
  });
