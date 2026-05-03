import { Command } from "commander";
import { spawnSync } from "child_process";
import os from "os";
import path from "path";

function getOpencodeMountPath(): string {
  const home = os.homedir();
  if (os.platform() === "win32") {
    return path.join(home, ".opencode");
  }
  return path.join(home, ".local", "share", "opencode");
}

export function setupOpencodeCommand(program: Command) {
  program
    .command("opencode")
    .description("Run opencode-labs Docker container in the current directory")
    .option("-i, --image <image>", "Docker image to use", "opencode-labs")
    .action((options) => {
      const cwd = process.cwd();
      const opencodePath = getOpencodeMountPath();
      const containerConfigPath = "/root/.local/share/opencode";

      const result = spawnSync(
        "docker",
        [
          "run", "--rm", "-it",
          "-v", `${cwd}:/workspace`,
          "-v", `${opencodePath}:${containerConfigPath}`,
          "-w", "/workspace",
          options.image,
        ],
        { stdio: "inherit" }
      );

      if (result.error) {
        console.error(`Failed to run Docker: ${result.error.message}`);
        process.exit(1);
      }

      process.exit(result.status ?? 0);
    });
}