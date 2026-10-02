// Gera preview/index.html: o build de dist/ em um único HTML (CSS e JS embutidos),
// com as imagens copiadas ao lado. Usado para publicar o Preview.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const saida = new URL('../preview/', import.meta.url);
const assets = readdirSync(new URL('assets/', dist));
const ler = (ext) => readFileSync(new URL(`assets/${assets.find((f) => f.endsWith(ext))}`, dist), 'utf8');

const html = readFileSync(new URL('index.html', dist), 'utf8');
const head = html
  .match(/<head>([\s\S]*)<\/head>/)[1]
  .replace(/<meta[^>]*>\s*/g, '')
  .replace(/<script[^>]*><\/script>\s*/g, '')
  .replace(/<link rel="stylesheet"[^>]*href="\.\/assets[^>]*>\s*/g, '');
const body = html
  .match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/<script[^>]*src="\.\/assets[^>]*><\/script>\s*/g, '');

rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });
writeFileSync(
  new URL('index.html', saida),
  `${head.trim()}\n<style>${ler('.css')}</style>\n${body.trim()}\n<script type="module">${ler('.js')}</script>\n`,
);
cpSync(new URL('images/', dist), new URL('images/', saida), { recursive: true });
if (existsSync(new URL('videos/', dist))) cpSync(new URL('videos/', dist), new URL('videos/', saida), { recursive: true });
console.log('Preview gerado em preview/');
