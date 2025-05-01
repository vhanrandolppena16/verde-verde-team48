// src/ffmpegUtils.js
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const convertWebMtoMP4 = async (webmBlob) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const webmData = await fetchFile(webmBlob);

  ffmpeg.FS('writeFile', 'input.webm', webmData);

  await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', 'output.mp4');

  const mp4Data = ffmpeg.FS('readFile', 'output.mp4');

  const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
  const url = URL.createObjectURL(mp4Blob);

  return url;
};
