#!/usr/bin/env bash
# Gera o vídeo horizontal (4:3) do hero a partir do original vertical (9:16).
# Recorta 712x534 do vídeo 716x1274 sem distorcer; a posição vertical do recorte
# muda a cada cena para manter a comida/pessoas em quadro (na 1ª cena desce
# suavemente da chapa até o prato). Se o vídeo original mudar, ajuste os tempos
# dos cortes de cena (segundos) e as posições (pixels a partir do topo).
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGINAL=videos-originais/video_beto_assim_assado.mp4
SAIDA=public/videos/hero

Y="if(lt(t,1.80),640*(st(0,clip((t-0.60)/1.00,0,1))*ld(0)*(3-2*ld(0))),\
if(lt(t,4.82),170,\
if(lt(t,6.32),520,\
if(lt(t,7.62),180,\
if(lt(t,9.30),400,\
if(lt(t,10.58),30,330))))))"
VF="crop=712:534:2:'$Y',scale=960:720:flags=lanczos,format=yuv420p"

mkdir -p "$SAIDA"
ffmpeg -nostdin -y -i "$ORIGINAL" -vf "$VF" -an -r 30 \
  -c:v libx264 -preset slow -crf 24 -profile:v high -movflags +faststart "$SAIDA/hero-video.mp4"
ffmpeg -nostdin -y -i "$ORIGINAL" -vf "$VF" -an -r 30 \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 "$SAIDA/hero-video.webm"
# Capa: carne fatiada na chapa (9,8 s)
ffmpeg -nostdin -y -ss 9.8 -i "$SAIDA/hero-video.mp4" -frames:v 1 -q:v 3 "$SAIDA/hero-video-poster.jpg"
