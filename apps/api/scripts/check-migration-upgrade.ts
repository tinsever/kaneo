import { execFile as execFileCallback } from "node:child_process";
import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client, Pool } from "pg";

const execFile = promisify(execFileCallback);
const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");
const currentMigrationsFolder = resolve(currentDir, "../drizzle");

function getFlagValue(name: string) {
  const prefix = `${name}=`;

  for (let index = 0; index < process.argv.length; index++) {
    const argument = process.argv[index];

    if (argument === name) {
      return process.argv[index + 1];
    }

    if (argument.startsWith(prefix)) {
      return argument.slice(prefix.length);
    }
  }

  return undefined;
}

function getDatabaseName(connectionString: string) {
  return new URL(connectionString).pathname.replace(/^\//, "");
}

function getAdminDatabaseUrl(connectionString: string) {
  const url = new URL(connectionString);
  url.pathname = "/postgres";
  return url.toString();
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function buildUpgradeDatabaseName(connectionString: string) {
  const baseName = getDatabaseName(connectionString);

  if (!baseName.endsWith("_test")) {
    throw new Error(
      `Refusing to manage non-test database "${baseName}". DATABASE_URL must point to a test database.`,
    );
  }

  const trimmedBaseName = baseName.replace(/_test$/, "");
  const suffix = `upgrade_${process.pid}_test`;
  const headroom = 63 - suffix.length - 1;
  const normalizedBaseName = trimmedBaseName
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .slice(0, Math.max(headroom, 1));

  return `${normalizedBaseName}_${suffix}`;
}

function buildDatabaseUrl(connectionString: string, databaseName: string) {
  const url = new URL(connectionString);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

async function recreateDatabase(
  connectionString: string,
  databaseName: string,
) {
  const adminClient = new Client({
    connectionString: getAdminDatabaseUrl(connectionString),
  });

  await adminClient.connect();

  try {
    await adminClient.query(
      `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1
          AND pid <> pg_backend_pid()
      `,
      [databaseName],
    );

    await adminClient.query(
      `DROP DATABASE IF EXISTS ${quoteIdentifier(databaseName)}`,
    );
    await adminClient.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
  } finally {
    await adminClient.end();
  }
}

async function dropDatabase(connectionString: string, databaseName: string) {
  const adminClient = new Client({
    connectionString: getAdminDatabaseUrl(connectionString),
  });

  await adminClient.connect();

  try {
    await adminClient.query(
      `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1
          AND pid <> pg_backend_pid()
      `,
      [databaseName],
    );

    await adminClient.query(
      `DROP DATABASE IF EXISTS ${quoteIdentifier(databaseName)}`,
    );
  } finally {
    await adminClient.end();
  }
}

async function exportMigrationsFromRef(ref: string) {
  const tempDir = await mkdtemp(join(tmpdir(), "kaneo-migration-upgrade-"));
  const archivePath = join(tempDir, "migrations.tar");

  await execFile("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
    cwd: repoRoot,
  });

  await execFile(
    "git",
    [
      "archive",
      `--output=${archivePath}`,
      "--format=tar",
      ref,
      "apps/api/drizzle",
    ],
    { cwd: repoRoot },
  );
  await execFile("tar", ["-xf", archivePath, "-C", tempDir], {
    cwd: repoRoot,
  });

  const migrationsFolder = join(tempDir, "apps/api/drizzle");
  await access(migrationsFolder);

  return {
    cleanup: async () => rm(tempDir, { recursive: true, force: true }),
    migrationsFolder,
  };
}

async function main() {
  const fromRef =
    getFlagValue("--from-ref") ||
    process.env.MIGRATION_BASE_REF ||
    process.env.GITHUB_BASE_REF;

  if (!fromRef) {
    throw new Error(
      "Missing base ref. Pass --from-ref=<git-ref> or set MIGRATION_BASE_REF.",
    );
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be defined");
  }

  const databaseName = buildUpgradeDatabaseName(connectionString);
  const databaseUrl = buildDatabaseUrl(connectionString, databaseName);

  console.log(`Preparing migration upgrade test database "${databaseName}"`);
  console.log(`Exporting base migrations from "${fromRef}"`);

  const { migrationsFolder: baseMigrationsFolder, cleanup } =
    await exportMigrationsFromRef(fromRef);

  let pool: Pool | null = null;

  try {
    await recreateDatabase(connectionString, databaseName);

    pool = new Pool({
      connectionString: databaseUrl,
    });

    const db = drizzle(pool);

    console.log(`Applying base migrations from "${fromRef}"`);
    await migrate(db, {
      migrationsFolder: baseMigrationsFolder,
    });

    console.log("Applying current branch migrations");
    await migrate(db, {
      migrationsFolder: currentMigrationsFolder,
    });

    console.log("Migration upgrade smoke test passed");
  } finally {
    if (pool) {
      await pool.end();
    }

    await cleanup();
    await dropDatabase(connectionString, databaseName);
  }
}

await main();
