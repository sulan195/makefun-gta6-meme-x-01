// makefun-gta6-meme-x-01 — entry program (Node 22, standard library only).
//
// The entry itself is a post on X: a GTA 6 launch-week meme whose picture
// shows make.fun's ghost mascot, posted from a public account with make.fun
// and the entrant's play code in its text. This program does the one thing
// the gate needs from the repository: it copies POST.json, which names that
// post's address, from the repository root to /output, where the house reads
// it and builds the judge's dossier from the post on X. Nothing this program
// writes about the post is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic by construction: a byte-for-byte copy, no network, no clock,
// no files outside the repository, so the grader's two runs agree.

// The copy is guarded: POST.json must parse and name an X post address,
// so a placeholder or a corrupt file fails loudly here instead of
// silently entering a post the house cannot read.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  const post = JSON.parse(raw) as { url?: unknown };
  if (typeof post.url !== 'string' || !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
    throw new Error('POST.json does not name an X post address (https://x.com/<handle>/status/<id>)');
  }
  writeFileSync(join(OUTPUT_DIR, 'POST.json'), raw);
} catch (err) {
  console.error(`POST.json could not be handed in from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
