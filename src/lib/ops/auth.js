const DEFAULT_ALLOWED_ROLES = ["admin", "ops"];
const SENSITIVE_PATH_PATTERN = /^\/(?:ops|api\/ops)(?:\/|$)/;
const PUBLIC_DEMO_HOSTS = new Set(["demo.movianx.com", "www.demo.movianx.com"]);

function normalizeHost(host = "") {
  return String(host).split(":")[0].toLowerCase();
}

export function isOpsPath(pathname = "") {
  return SENSITIVE_PATH_PATTERN.test(String(pathname).replace(/^\/+/, "/"));
}

export function isPublicDemoHost(host = "") {
  return PUBLIC_DEMO_HOSTS.has(normalizeHost(host));
}

export function parseAllowedRoles(value = "") {
  const roles = String(value)
    .split(",")
    .map(role => role.trim().toLowerCase())
    .filter(Boolean);
  return roles.length ? roles : DEFAULT_ALLOWED_ROLES;
}

export function readOpsAccounts(env = process.env) {
  const accounts = [];
  const pairs = [
    ["admin", env.OPS_ADMIN_USERNAME, env.OPS_ADMIN_PASSWORD],
    ["ops", env.OPS_OPERATOR_USERNAME || env.OPS_OPS_USERNAME, env.OPS_OPERATOR_PASSWORD || env.OPS_OPS_PASSWORD],
    ["viewer", env.OPS_VIEWER_USERNAME, env.OPS_VIEWER_PASSWORD],
  ];

  for (const [role, username, password] of pairs) {
    if (!username || !password) continue;
    accounts.push({
      role,
      username: String(username),
      password: String(password),
    });
  }

  if (env.NODE_ENV !== "production" && accounts.length === 0) {
    accounts.push({
      role: "admin",
      username: "ops",
      password: "movianx-ops-dev",
    });
  }

  return accounts;
}

export function parseBasicAuthorization(header = "") {
  if (!header || !String(header).startsWith("Basic ")) return null;

  try {
    const encoded = String(header).slice(6);
    const decoded = typeof atob === "function"
      ? atob(encoded)
      : Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator <= 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export function authenticateOpsRequest(headers, env = process.env) {
  const credentials = parseBasicAuthorization(headers.get("authorization"));
  const accounts = readOpsAccounts(env);
  const allowedRoles = parseAllowedRoles(env.OPS_ALLOWED_ROLES);

  if (!accounts.length) {
    return { ok: false, status: 503, reason: "ops_auth_not_configured" };
  }

  if (!credentials) {
    return { ok: false, status: 401, reason: "credentials_required" };
  }

  const account = accounts.find(candidate => (
    candidate.username === credentials.username &&
    candidate.password === credentials.password
  ));

  if (!account) {
    return { ok: false, status: 401, reason: "credentials_invalid" };
  }

  if (!allowedRoles.includes(account.role)) {
    return { ok: false, status: 403, reason: "role_forbidden", role: account.role };
  }

  return { ok: true, status: 200, role: account.role, username: account.username };
}

export function getOpsRealm() {
  return "Movianx Operations";
}
