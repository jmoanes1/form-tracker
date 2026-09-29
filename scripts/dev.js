// Starts the Express API and the Vite client together.
// Usage from the project root:  npm run dev
//
// No extra dependency is used, this only relies on Node's own
// child_process module.

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const isWindows = process.platform === "win32";
const viteBin = path.join(root, "client", "node_modules", "vite", "bin", "vite.js");

const tasks = [
  {
    name: "api",
    cwd: path.join(root, "server"),
    command: process.execPath,
    args: ["--watch", "server.js"],
    shell: false,
  },
  {
    name: "client",
    cwd: path.join(root, "client"),
    command: fs.existsSync(viteBin) ? process.execPath : "npm",
    args: fs.existsSync(viteBin) ? [viteBin] : ["run", "dev"],
    shell: fs.existsSync(viteBin) ? false : isWindows,
  },
];

function prefixOutput(name, data) {
  const lines = String(data)
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `[${name}] ${line}\n`)
    .join("");

  process.stdout.write(lines);
}

function stopAll() {
  children.forEach((child) => {
    if (child.killed || child.exitCode !== null) {
      return;
    }

    if (process.platform === "win32") {
      // On Windows npm runs through a shell, so the whole tree has to be
      // stopped, otherwise the API keeps running in the background.
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore",
      });
    } else {
      child.kill();
    }
  });
}

const children = tasks.map((task) => {
  // Directly invoking the Node binary for both the API and client avoids
  // Windows .cmd shim failures ("spawn EINVAL" since Node 20.12+), Node 24
  // shell deprecation warnings (DEP0190), and cmd.exe batch job exit prompts.
  // This ensures the Express API reliably comes up on http://127.0.0.1:5000.
  // If vite.js isn't found locally, it gracefully falls back to npm.
  const child = spawn(task.command, task.args, {
    cwd: task.cwd,
    shell: task.shell,
  });

  child.stdout.on("data", (data) => prefixOutput(task.name, data));
  child.stderr.on("data", (data) => prefixOutput(task.name, data));

  child.on("error", (error) => {
    console.error(
      `[${task.name}] failed to start: ${error.message}\n` +
        `[${task.name}] Start it manually in another terminal: cd ${task.cwd} && npm run dev\n`
    );

    stopAll();
  });

  child.on("exit", (code) => {
    console.log(`[${task.name}] stopped (exit code ${code})`);

    // If one of the two stops, stop the other one as well.
    stopAll();
  });

  return child;
});

console.log("[dev] API  -> http://localhost:5000");
console.log("[dev] App  -> http://localhost:5173");
console.log("[dev] Press Ctrl+C to stop both.\n");

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
