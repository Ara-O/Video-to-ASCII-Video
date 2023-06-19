import ffmpeg from "ffmpeg";

// try {
//   const process = new ffmpeg("./duck.mp4");
//   process.then(
//     (video) => {
//       console.log("video", video);
//     },
//     (err) => {
//       console.log("Error", err);
//     }
//   );
// } catch (e: any) {
//   console.log(e.msg);
// }

try {
  var process = new ffmpeg("./duck.mp4");
  process.then(
    function (video) {
      // Callback mode
      video.fnExtractFrameToJPG(
        "./test",
        {
          frame_rate: 1,
          number: 5,
          file_name: "my_frame_%t_%s",
        },
        function (error, files) {
          if (!error) console.log("Frames: " + files);
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
