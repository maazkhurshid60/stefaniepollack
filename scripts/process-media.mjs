// One-off asset pipeline: compresses the client's raw photos/video from
// materal/ into public/. Not part of the build — run manually when new
// source assets show up.
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import convertHeic from "heic-convert";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "materal", "Website Project 2024");
const PUB = join(ROOT, "public");

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function fmtSize(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function processJpeg(src, dest, maxWidth) {
  ensureDir(dest);
  const before = readFileSync(src).length;
  await sharp(src)
    .rotate() // respect EXIF orientation, then strip it
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  const after = readFileSync(dest).length;
  console.log(`image  ${dest.replace(ROOT, "")}  ${fmtSize(before)} -> ${fmtSize(after)}`);
}

async function processHeic(src, dest, maxWidth) {
  ensureDir(dest);
  const before = readFileSync(src).length;
  const input = readFileSync(src);
  const jpegBuffer = await convertHeic({ buffer: input, format: "JPEG", quality: 0.92 });
  await sharp(jpegBuffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  const after = readFileSync(dest).length;
  console.log(`heic   ${dest.replace(ROOT, "")}  ${fmtSize(before)} -> ${fmtSize(after)}`);
}

function processVideo(src, dest, { maxWidth, keepAudio, trimSeconds, poster }) {
  ensureDir(dest);
  const before = readFileSync(src).length;
  const args = ["-y", "-i", src];
  if (trimSeconds) args.push("-t", String(trimSeconds));
  const filters = [`scale='min(${maxWidth},iw)':-2`];
  args.push("-vf", filters.join(","));
  args.push("-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p");
  if (keepAudio) {
    args.push("-c:a", "aac", "-b:a", "128k");
  } else {
    args.push("-an");
  }
  args.push("-movflags", "+faststart", dest);
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
  const after = readFileSync(dest).length;
  console.log(`video  ${dest.replace(ROOT, "")}  ${fmtSize(before)} -> ${fmtSize(after)}`);

  if (poster) {
    ensureDir(poster);
    execFileSync(
      ffmpegPath,
      ["-y", "-i", dest, "-vf", "select=eq(n\\,0)", "-vframes", "1", poster],
      { stdio: "inherit" }
    );
    console.log(`poster ${poster.replace(ROOT, "")}`);
  }
}

const IMAGES = [
  { src: "Headshot/A7405273 FINAL Headshot.jpg", dest: "images/stefanie/headshot.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Professional Photos/Realtor-2/009_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5245.jpg.JPG", dest: "images/stefanie/portrait-1.jpg", maxWidth: 1800 },
  { src: "Stefanie Pollack/Professional Photos/Realtor-2/012_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5323.jpg.JPG", dest: "images/stefanie/portrait-2.jpg", maxWidth: 1800 },
  { src: "Stefanie Pollack/Professional Photos/Realtor-2/015_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5349.jpg.JPG", dest: "images/stefanie/portrait-3.jpg", maxWidth: 1800 },
  { src: "Website Images/001_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5292.jpg.JPG", dest: "images/stefanie/lifestyle-1.jpg", maxWidth: 1800 },
  { src: "Website Images/002_09.2821_Stefanie-Pollack_Nicole-Goddard-Photography_423A3447.jpg.JPG", dest: "images/stefanie/lifestyle-2.jpg", maxWidth: 1800 },
  { src: "Website Images/006_09.2821_Stefanie-Pollack_Nicole-Goddard-Photography_423A3473.jpg.JPG", dest: "images/stefanie/lifestyle-3.jpg", maxWidth: 1800 },
  { src: "Website Images/011_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5318.jpg.JPG", dest: "images/stefanie/lifestyle-4.jpg", maxWidth: 1800 },
  { src: "Website Images/059_09.2821_Stefanie-Pollack_Nicole-Goddard-Photography_423A3853.jpg.JPG", dest: "images/stefanie/lifestyle-5.jpg", maxWidth: 1800 },
  { src: "Website Images/065_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5720.jpg.JPG", dest: "images/stefanie/lifestyle-6.jpg", maxWidth: 1800 },
  { src: "Website Images/070_02.07.22_Stefanie-Pollack_Nicole-Goddard-Photography_423A5748.jpg.JPG", dest: "images/stefanie/lifestyle-7.jpg", maxWidth: 1800 },
];

const HEIC_IMAGES = [
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7174.HEIC", dest: "images/philanthropy/food-drive-1.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7194.HEIC", dest: "images/philanthropy/food-drive-2.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7201.HEIC", dest: "images/philanthropy/food-drive-3.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7204.HEIC", dest: "images/philanthropy/food-drive-4.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7214.HEIC", dest: "images/philanthropy/food-drive-5.jpg", maxWidth: 1600 },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7229.HEIC", dest: "images/philanthropy/food-drive-6.jpg", maxWidth: 1600 },
];

const VIDEOS = [
  {
    src: "Horizontal.mov",
    dest: "video/hero.mp4",
    maxWidth: 1280,
    keepAudio: false,
    poster: "images/hero-poster.jpg",
  },
  {
    src: "Stefanie Pollack/2025 year in review/stef.mp4",
    dest: "video/year-in-review.mp4",
    maxWidth: 960,
    keepAudio: true,
    poster: "images/philanthropy/year-in-review-poster.jpg",
  },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7188.MOV", dest: "video/philanthropy/food-drive-1.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/food-drive-clip-1-poster.jpg" },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7190.MOV", dest: "video/philanthropy/food-drive-2.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/food-drive-clip-2-poster.jpg" },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7203.MOV", dest: "video/philanthropy/food-drive-3.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/food-drive-clip-3-poster.jpg" },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7213.MOV", dest: "video/philanthropy/food-drive-4.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/food-drive-clip-4-poster.jpg" },
  { src: "Stefanie Pollack/Events/Food Drive 2025/IMG_7234.MOV", dest: "video/philanthropy/food-drive-5.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/food-drive-clip-5-poster.jpg" },
  { src: "Stefanie Pollack/Events/IMPACT 2025/copy_6005AC28-83FA-4A91-8A9A-B5472B35EFA8.MOV", dest: "video/philanthropy/impact-1.mp4", maxWidth: 720, keepAudio: false, poster: "images/philanthropy/impact-clip-1-poster.jpg" },
  { src: "Stefanie Pollack/Events/IMPACT 2025/IMG_0626.MOV", dest: "video/philanthropy/impact-2.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/impact-clip-2-poster.jpg" },
  { src: "Stefanie Pollack/Events/IMPACT 2025/IMG_0650.MOV", dest: "video/philanthropy/impact-3.mp4", maxWidth: 960, keepAudio: false, poster: "images/philanthropy/impact-clip-3-poster.jpg" },
];

async function main() {
  for (const { src, dest, maxWidth } of IMAGES) {
    await processJpeg(join(SRC, src), join(PUB, dest), maxWidth);
  }
  for (const { src, dest, maxWidth } of HEIC_IMAGES) {
    await processHeic(join(SRC, src), join(PUB, dest), maxWidth);
  }
  for (const { src, dest, maxWidth, keepAudio, trimSeconds, poster } of VIDEOS) {
    processVideo(join(SRC, src), join(PUB, dest), {
      maxWidth,
      keepAudio,
      trimSeconds,
      poster: poster ? join(PUB, poster) : undefined,
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
