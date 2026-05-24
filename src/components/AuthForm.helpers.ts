export type AuthMode = "login" | "register";

type AuthModeCopy = {
  title: string;
  helper: string;
  submitLabel: string;
  pendingLabel: string;
};

const authModeCopy: Record<AuthMode, AuthModeCopy> = {
  login: {
    title: "Login with",
    helper: "Choose one account to continue.",
    submitLabel: "Login",
    pendingLabel: "Logging in...",
  },
  register: {
    title: "Create an account",
    helper: "Register with a username and password.",
    submitLabel: "Create account",
    pendingLabel: "Creating account...",
  },
};

export function getAuthModeCopy(mode: AuthMode) {
  return authModeCopy[mode];
}

export function getSafeAuthMode(mode: string | null | undefined): AuthMode {
  return mode === "register" ? "register" : "login";
}

export function getSafeAuthRedirectPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  return path;
}

export function buildAuthCallbackUrl(origin: string, redirectTo: string) {
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", getSafeAuthRedirectPath(redirectTo));
  return callbackUrl.toString();
}

export function buildAuthModeHref(mode: AuthMode, redirectTo: string) {
  const params = new URLSearchParams();
  params.set("mode", mode);

  if (getSafeAuthRedirectPath(redirectTo) !== "/dashboard") {
    params.set("redirectTo", redirectTo);
  }

  return `/auth?${params.toString()}`;
}
