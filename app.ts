import ffmpeg from "ffmpeg";
import { Image } from "image-js";
import fs from "fs";
// try {
//   var process = new ffmpeg("./duck.mp4");
//   process.then(
//     function (video) {
//       // Callback mode
//       video.fnExtractFrameToJPG(
//         "./test",
//         {
//           frame_rate: 1,
//           number: 5,
//           file_name: "my_frame_%t_%s",
//         },
//         function (error, files) {
//           if (!error) console.log("Frames: " + files);

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

Image.load("./test/my_frame_1687133062649_640x360_1.jpg").then((img) => {
  let resizedImg = img.resize({
    height: 40,
    preserveAspectRatio: true,
  });
  console.log(resizedImg);
  for (let i = 0; i < resizedImg.data.length / 4; i++) {
    let index = 4 * i;
    let rVal = resizedImg.data[index + 1];
    let gVal = resizedImg.data[index + 2];
    let bVal = resizedImg.data[index + 3];
    let aVal = resizedImg.data[index + 4];

    let average = (rVal + gVal + bVal + aVal) / 4;
    if (average >= 235) {
      fs.appendFileSync("test2.txt", ".");
    } else {
      fs.appendFileSync("test2.txt", "@");
    }

    if (i !== 0 && i % resizedImg.width === 0) {
      fs.appendFileSync("test2.txt", "\r\n");
    }
    // fs.appendFileSync("test2.txt", "" + resizedImg.data[i]);
  }
  fs.writeFileSync("test.txt", resizedImg.data);
  resizedImg.save("test.png");
});

// Use https://github.com/h2non/videoshow to make video
