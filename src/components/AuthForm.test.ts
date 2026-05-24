import { describe, expect, it } from "vitest";
import {
  buildAuthCallbackUrl,
  buildAuthModeHref,
  getAuthModeCopy,
  getSafeAuthMode,
  getSafeAuthRedirectPath,
} from "./AuthForm.helpers";

describe("AuthForm helpers", () => {
  it("uses safe in-app redirects for password auth", () => {
    expect(getSafeAuthRedirectPath("/admin")).toBe("/admin");
    expect(getSafeAuthRedirectPath("https://evil.test")).toBe("/dashboard");
    expect(getSafeAuthRedirectPath("//evil.test")).toBe("/dashboard");
    expect(getSafeAuthRedirectPath(null)).toBe("/dashboard");
  });

  it("builds callback URLs for registration email confirmation", () => {
    expect(buildAuthCallbackUrl("https://crucible.test", "/quiz/123")).toBe(
      "https://crucible.test/auth/callback?next=%2Fquiz%2F123",
    );
  });

  it("labels login and register modes clearly", () => {
    expect(getSafeAuthMode("register")).toBe("register");
    expect(getSafeAuthMode("surprise")).toBe("login");
    expect(getAuthModeCopy("login").submitLabel).toBe("Login");
    expect(getAuthModeCopy("register").submitLabel).toBe("Create account");
  });

  it("builds mode links that preserve safe redirects", () => {
    expect(buildAuthModeHref("register", "/admin")).toBe("/auth?mode=register&redirectTo=%2Fadmin");
    expect(buildAuthModeHref("login", "/dashboard")).toBe("/auth?mode=login");
  });
});
