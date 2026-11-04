import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const node = process.execPath;
const commands = [
  ["Marketplace API", [path.join(rootDir, "server", "server.js")]],
  ["Vite", [path.join(rootDir, "node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1"]],
];

const children = commands.map(([name, args]) => {
  const child = spawn(node, args, { cwd: rootDir, stdio: "inherit" });
  child.on("error", (error) => {
    console.error(`${name} failed to start:`, error);
    shutdown(1);
  });
  child.on("exit", (code) => {
    if (!shuttingDown) shutdown(code || 0);
  });
  return child;
});

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = code;
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
