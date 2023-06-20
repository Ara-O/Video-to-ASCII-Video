// const videoshow = require("videoshow");
// const fs = require("fs");

// let images = fs.readdirSync("video-image-frames");
// images = images.map((img) => `./video-image-frames/${img}`);

// var videoOptions = {
//   fps: 15,
//   loop: 0.1, // seconds
//   transition: false,
//   videoBitrate: 1024,
//   videoCodec: "libx264",
//   size: "640x?",
//   audioBitrate: "128k",
//   audioChannels: 2,
//   format: "mp4",
//   pixelFormat: "yuv420p",
// };
// videoshow(images, videoOptions)
//   .save("video.mp4")
//   .on("start", function (command) {
//     console.log("ffmpeg process started:", command);
//   })
//   .on("error", function (err, stdout, stderr) {
//     console.error("Error:", err);
//     console.error("ffmpeg stderr:", stderr);
//   })
//   .on("end", function (output) {
//     console.error("Video created in:", output);
//   });

art
  .artwork({
    artwork: "textfiles.com/art/st-char.asc",
  })
  .lines(31, 45, function (rendered) {
    //cleanup non-unix terminators
    rendered = rendered.replace(/\r/g, "");
    rendered = colorInBonesShirt(rendered);
    art
      .image({
        filepath: "~/Images/earth_in_space.jpg",
        alphabet: "ultra-wide",
      })
      .overlay(
        rendered,
        {
          x: 0,
          y: -1,
          style: "red+blink",
          transparent: "&",
        },
        function (final) {
          console.log(final);
        }
      );
  });
