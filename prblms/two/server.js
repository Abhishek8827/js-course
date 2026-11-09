"use strict";

require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const express = require("express");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 4000;

const getEnvConfig = () => ({
  baseUrl: (process.env.TVSM_API_BASE_URL || "").trim().replace(/\/+$/, ""),
  apiKey: (process.env.TVSM_API_KEY || "").trim(),
  passcode: (process.env.PORTAL_ACCESS_CODE || "").trim(),
});

const safeEqual = (a, b) => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

// Block any mutating requests to /api/* (except passcode verification check)
app.use("/api", (req, res, next) => {
  if (req.method !== "GET" && req.path !== "/auth/verify") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Read-only portal: Only GET requests are allowed.",
    });
  }
  return next();
});

app.use(express.json({ limit: "16kb" }));

// Public config endpoint so frontend knows if backend proxy & passcode are active
app.get("/api/config", (req, res) => {
  const { baseUrl, apiKey, passcode } = getEnvConfig();
  const isPlaceholderKey =
    !apiKey || apiKey === "tvsm_ro_paste_your_secret_key_here";

  res.json({
    success: true,
    data: {
      proxyAvailable: true,
      configured: Boolean(baseUrl && !isPlaceholderKey),
      requiresPasscode: Boolean(passcode),
    },
  });
});

// Verify portal passcode when PORTAL_ACCESS_CODE is set
app.post("/api/auth/verify", (req, res) => {
  const { passcode } = getEnvConfig();
  if (!passcode) {
    return res.json({ success: true, valid: true });
  }

  const provided = String(req.body?.passcode || "");
  if (!provided || !safeEqual(provided, passcode)) {
    return res.status(401).json({
      success: false,
      message: "Invalid access code.",
    });
  }

  return res.json({ success: true, valid: true });
});

// Middleware to verify optional portal passcode on data endpoints
const requirePortalPasscode = (req, res, next) => {
  const { passcode } = getEnvConfig();
  if (!passcode) return next();

  const provided = req.headers["x-portal-passcode"] || "";
  if (!provided || !safeEqual(provided, passcode)) {
    return res.status(401).json({
      success: false,
      code: "PASSCODE_REQUIRED",
      message: "Private portal access code required.",
    });
  }

  return next();
};

// Helper to forward read-only GET requests to TVSMNEPA External API
async function forwardToTvsm(req, res, upstreamPath, allowedQueryKeys = []) {
  const { baseUrl, apiKey } = getEnvConfig();
  const isPlaceholderKey =
    !apiKey || apiKey === "tvsm_ro_paste_your_secret_key_here";

  if (!baseUrl || isPlaceholderKey) {
    return res.status(503).json({
      success: false,
      code: "PROXY_NOT_CONFIGURED",
      message:
        "Backend .env is not configured yet. Set TVSM_API_BASE_URL and TVSM_API_KEY in prblms/two/.env, or click 'API Settings' to connect directly.",
    });
  }

  try {
    const targetUrl = new URL(`${baseUrl}${upstreamPath}`);
    allowedQueryKeys.forEach((key) => {
      const val = req.query[key];
      if (val !== undefined && val !== null && val !== "") {
        targetUrl.searchParams.set(key, String(val));
      }
    });

    const upstreamRes = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });

    const contentType = upstreamRes.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await upstreamRes.json()
      : { success: false, message: await upstreamRes.text() };

    return res.status(upstreamRes.status).json(payload);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: `Unable to reach TVSMNEPA Attendance API (${error.message}).`,
    });
  }
}

// Read-only proxy endpoints
app.get("/api/status", requirePortalPasscode, (req, res) =>
  forwardToTvsm(req, res, "/status"),
);

app.get("/api/sessions", requirePortalPasscode, (req, res) =>
  forwardToTvsm(req, res, "/sessions"),
);

app.get("/api/classes", requirePortalPasscode, (req, res) =>
  forwardToTvsm(req, res, "/classes", ["sessionId", "group"]),
);

app.get("/api/overview", requirePortalPasscode, (req, res) =>
  forwardToTvsm(req, res, "/overview", ["date", "sessionId", "group"]),
);

app.get("/api/classes/:classId/attendance", requirePortalPasscode, (req, res) =>
  forwardToTvsm(
    req,
    res,
    `/classes/${encodeURIComponent(req.params.classId)}/attendance`,
    ["date"],
  ),
);

app.get(
  "/api/students/:scholarNumber/attendance",
  requirePortalPasscode,
  (req, res) =>
    forwardToTvsm(
      req,
      res,
      `/students/${encodeURIComponent(req.params.scholarNumber)}/attendance`,
      ["from", "to", "month", "year", "sessionId"],
    ),
);

app.get("/api/monthly-summary", requirePortalPasscode, (req, res) =>
  forwardToTvsm(req, res, "/monthly-summary", ["year", "month", "sessionId"]),
);

// Serve static frontend files
app.use(express.static(__dirname, { index: "attendance.html" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "attendance.html"));
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `TVSM Read-Only Attendance Portal running at http://localhost:${PORT}`,
    );
  });
}

module.exports = app;
