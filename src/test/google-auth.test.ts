import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const auth = readFileSync(resolve(process.cwd(), "src/routes/auth.tsx"), "utf8");
const migration = readFileSync(
  resolve(process.cwd(), "drizzle/migrations/0014_apply_referral_code_after_oauth.sql"),
  "utf8",
);

describe("Google sign-in", () => {
  it("goes through the managed sign-in helper, never the raw Supabase OAuth call", () => {
    expect(auth).toContain('lovable.auth.signInWithOAuth("google"');
    expect(auth).not.toContain("supabase.auth.signInWithOAuth");
  });

  it("comes back to the public sign-in page, never a protected route", () => {
    expect(auth).toContain("${window.location.origin}/auth");
    expect(auth).not.toContain('redirect_uri: `${window.location.origin}/account');
  });
});

describe("Referral codes handed over after Google sign-in", () => {
  it("lets only a brand-new, still-unattributed account claim a code", () => {
    expect(migration).toContain("IF v_me.referred_by IS NOT NULL THEN RETURN false; END IF;");
    expect(migration).toContain("IF v_me.created_at < now() - interval '30 minutes' THEN RETURN false; END IF;");
  });

  it("refuses a code that belongs to the account claiming it", () => {
    expect(migration).toContain("IF v_me.user_id = v_referrer THEN RETURN false; END IF;");
    expect(migration).toContain("lower(p.email) = lower(v_me.email)");
  });

  it("is callable by signed-in clients only", () => {
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated");
    expect(migration).toContain("REVOKE EXECUTE ON FUNCTION public.apply_referral_code(text) FROM PUBLIC, anon");
  });
});
