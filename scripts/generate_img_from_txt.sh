#!/bin/bash
ffmpeg -f lavfi -i color=c=black:s=1280x720 -vf "drawtext=fontfile=../fonts/consola.ttf:text=YourTextHere:fontsize=24:fontcolor=white:x=(w-tw)/2:y=(h-th)/2" -vframes 1 test.png
