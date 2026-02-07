import { neon } from "@neondatabase/serverless";

const DB_URL_ENV_KEYS = [
  "exocortex_POSTGRES_URL",
  "exocortex_DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
] as const;

function getDatabaseUrl(): string {
  const problems: string[] = [];

  for (const key of DB_URL_ENV_KEYS) {
    const rawValue = process.env[key];
    if (!rawValue) continue;

    const value = rawValue.trim();
    if (!value) continue;

    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      problems.push(`${key}=invalid-url`);
      continue;
    }

    // Skip common placeholder values copied from sample env files.
    if (!parsed.hostname || parsed.hostname.toLowerCase() === "host") {
      problems.push(`${key}=placeholder-host`);
      continue;
    }

    return value;
  }

  throw new Error(
    `Missing valid database URL. Checked keys: ${DB_URL_ENV_KEYS.join(", ")}.` +
      ` Problems: ${problems.join(", ") || "none"}.` +
      ` In Vercel, ensure a real Neon connection string is set and remove placeholders like '@host'.`
  );
}

function getSQL() {
  return neon(getDatabaseUrl());
}

let schemaReadyPromise: Promise<void> | null = null;

async function ensureWaitlistSchema(sql: ReturnType<typeof getSQL>): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL DEFAULT '',
          email TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      // Case-insensitive uniqueness prevents duplicate signups by email.
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_lower_unique
        ON waitlist ((LOWER(email)))
      `;
    })();
  }

  await schemaReadyPromise;
}

export interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

/**
 * Insert a new waitlist entry. Returns { inserted: true } on success,
 * or { inserted: false, reason: 'duplicate' } if the email already exists.
 */
export async function insertWaitlistEntry(
  name: string,
  email: string
): Promise<{ inserted: boolean; reason?: string }> {
  const sql = getSQL();
  await ensureWaitlistSchema(sql);

  try {
    const result = await sql`
      INSERT INTO waitlist (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT ((LOWER(email))) DO NOTHING
      RETURNING id
    `;

    if (result.length === 0) {
      return { inserted: false, reason: "duplicate" };
    }

    return { inserted: true };
  } catch (err: unknown) {
    // Fallback: catch unique violation if ON CONFLICT doesn't match
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { inserted: false, reason: "duplicate" };
    }
    throw err;
  }
}

/**
 * Get the total count of waitlist entries.
 */
export async function getWaitlistCount(): Promise<number> {
  const sql = getSQL();
  await ensureWaitlistSchema(sql);

  const result = await sql`SELECT COUNT(*)::int AS count FROM waitlist`;
  return result[0]?.count ?? 0;
}

