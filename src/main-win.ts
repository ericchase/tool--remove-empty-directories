import fs from 'fs';
import { U8StreamReadAll } from './lib/Stream/ReadAll.js';

const [, , ...args] = Bun.argv;

if (args[0]) {
  const proc = Bun.spawn(['lstree', args[0]]);
  await proc.exited;

  const paths: string[] = [];
  const bytes = await U8StreamReadAll(proc.stdout);
  for (const entry of new TextDecoder().decode(bytes).split('\n')) {
    if (entry[0] === 'D') {
      paths.push(entry.slice(2));
    }
  }
  const pathSet = new Set(paths.reverse());

  console.log();

  while (true) {
    console.log(pathSet.size, 'remaining');
    const jobs: Promise<void>[] = [];
    for (const path of pathSet) {
      jobs.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            await fs.promises.rmdir(path);
            console.log('deleted:', path);
            pathSet.delete(path);
            return resolve();
          } catch (error) {
            // @ts-ignore
            switch (error.code) {
              case 'ENOENT': // windows
              case 'ENOTDIR': // linux
                pathSet.delete(path);
                break;
            }
            return reject();
          }
        }),
      );
    }
    let done = true;
    for (const { status } of await Promise.allSettled(jobs)) {
      if (status === 'fulfilled') {
        done = false;
        break;
      }
    }
    if (done) {
      break;
    }
    console.log();
  }
} else {
  console.log('Supply a directory path.');
}
