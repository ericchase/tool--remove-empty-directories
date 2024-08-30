import fs from 'fs';

const [, , ...args] = Bun.argv;

if (args[0]) {
  const pathSet = new Set(
    (
      await Array.fromAsync(
        new Bun.Glob('**').scan({
          absolute: true,
          cwd: args[0],
          dot: true,
          onlyFiles: false,
        }),
      )
    ).reverse(),
  );

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
