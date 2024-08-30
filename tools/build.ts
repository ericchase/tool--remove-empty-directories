const cmds = [
  'bun build --compile --minify --target=bun-windows-x64 ./src/main.ts --outfile red.exe', // Windows x64
  'bun build --compile --minify --target=bun-linux-x64 ./src/main.ts --outfile red', // Linux x64 (most servers)
  // windows alternative
  'bun build --compile --minify --target=bun-windows-x64 ./src/main-win.ts --outfile redx.exe', // Windows x64
];

const jobs = cmds.map((cmd) => Bun.spawn(cmd.split(' ')));
for (const job of jobs) {
  await job.exited;
}
