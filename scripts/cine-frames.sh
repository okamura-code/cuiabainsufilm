#!/usr/bin/env bash
# Scroll-cinema frames for the hero: slices the A→B transition video into 75 WebP frames (15 fps, 1280x720).
# Source video: raw/scroll-cinema/transition-raw.mp4 (Higgsfield Seedance 2.0 Mini, start = noon/clear glass, end = current hero).
# Keep `cineFrames` in src/components/Hero.astro equal to the number of files produced.
set -e
mkdir -p public/media/cine && rm -f public/media/cine/*.webp
ffmpeg -hide_banner -loglevel error -y -i raw/scroll-cinema/transition-raw.mp4 \
  -vf "fps=15,scale=1280:720:flags=lanczos" -frames:v 75 -start_number 0 \
  -c:v libwebp -quality 72 -compression_level 6 public/media/cine/f%03d.webp
ls public/media/cine | wc -l
