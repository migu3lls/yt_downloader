/**
 * yt-downloader-sdk
 *
 * Developer-first TypeScript SDK & Security Engine for hardened YouTube URL
 * sanitization, zero-shell-injection yt-dlp orchestration, token-bucket rate
 * limiting, and ephemeral session management.
 */

export {
  validateYouTubeUrl,
  type ValidatedYouTubeUrl,
} from "./lib/security/validator";

export { checkRateLimit } from "./lib/security/rateLimit";

export {
  createDownloadJob,
  getJob,
  cleanupJob,
  type DownloadJob,
} from "./lib/jobs/downloadManager";

export {
  parseCliArgs,
  formatHelpText,
  runCli,
  type CliOptions,
} from "./cli/index";

export {
  formatBytes,
  formatDuration,
} from "./lib/utils";
