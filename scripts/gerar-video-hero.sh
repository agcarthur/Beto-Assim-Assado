#!/usr/bin/env bash
# Gera o vídeo horizontal (4:3) do hero a partir do original vertical (9:16).
# Recorta 720x540 do vídeo 720x1280 sem distorcer; a posição vertical do recorte
# muda a cada cena para manter a comida/pessoas em quadro (na 1ª cena desce
# suavemente acompanhando a câmera). Se o vídeo original mudar, ajuste os tempos
# dos cortes de cena (segundos) e as posições (pixels a partir do topo).
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGINAL=videos-originais/video_2_beto_assim_assado.mp4
SAIDA=public/videos/hero
# O original (720x1280) termina com 1,8 s de tela preta (24,6 s em diante): cortado
# para o loop não piscar em preto.
DURACAO=24.55

# Posição vertical (px do topo) do recorte 720x540 em cada cena. Entre 18,8 e 20,4 s a
# câmera sobe da batata para o frango: o recorte acompanha com transição suave.
Y="if(lt(t,1.45),250,\
if(lt(t,6.2),480,\
if(lt(t,9.4),400,\
if(lt(t,18.8),450,\
if(lt(t,20.4),450-300*(st(0,(t-18.8)/1.6)*ld(0)*(3-2*ld(0))),\
if(lt(t,22.2),150,380))))))"
VF="crop=720:540:0:'$Y',scale=960:720:flags=lanczos,format=yuv420p"

mkdir -p "$SAIDA"
ffmpeg -nostdin -y -i "$ORIGINAL" -t "$DURACAO" -vf "$VF" -an -r 30 \
  -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart "$SAIDA/hero-video.mp4"
ffmpeg -nostdin -y -i "$ORIGINAL" -t "$DURACAO" -vf "$VF" -an -r 30 \
  -c:v libvpx-vp9 -crf 37 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 "$SAIDA/hero-video.webm"
# Capa: chapa com carnes e linguiça (8,8 s)
ffmpeg -nostdin -y -ss 8.8 -i "$SAIDA/hero-video.mp4" -frames:v 1 -q:v 3 "$SAIDA/hero-video-poster.jpg"
