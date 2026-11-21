import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";
import {
  applicationDefault,
  getApps as getAdminApps,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { rateLimit } from "express-rate-limit";
import {
  checkoutConfig,
  createCheckoutSession,
  stripeWebhook,
} from "./src/server/stripe.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_EMAIL = "musclehed03@gmail.com";

const adminApp =
  getAdminApps()[0] ??
  initializeAdminApp({
    credential: applicationDefault(),
    projectId: "dollhouse-deviants",
  });

type AuthenticatedRequest = Request & {
  authUid?: string;
};

async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      error: "unauthenticated",
      message: "Sign in is required.",
    });
  }

  try {
    const decoded = await getAdminAuth(adminApp).verifyIdToken(token);

    if (
      decoded.email !== ADMIN_EMAIL ||
      decoded.email_verified !== true
    ) {
      return res.status(403).json({
        error: "forbidden",
        message: "Pinkie is currently restricted to the founder.",
      });
    }

    (req as AuthenticatedRequest).authUid = decoded.uid;
    return next();
  } catch {
    return res.status(401).json({
      error: "unauthenticated",
      message: "Your session is invalid or has expired.",
    });
  }
}

const auditLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) =>
    (req as AuthenticatedRequest).authUid ?? "unauthenticated",
  message: {
    error: "rate_limited",
    message: "Too many requests. Try again shortly.",
  },
});

const checkoutLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "rate_limited",
    message: "Too many checkout attempts. Try again shortly.",
  },
});
async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  const PORT = Number(process.env.PORT ?? 8080);

  // Stripe webhook needs the raw body for signature verification, so it
  // is registered BEFORE the JSON parser below. See src/server/stripe.ts.
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json", limit: "16kb" }),
    stripeWebhook,
  );

  // JSON Body Parser for API routes
app.use(express.json({ limit: "16kb" }));

  // Implement requested headers
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.set("Cache-Control", "private, no-store");
  } else {
    res.set("Cache-Control", "public, no-cache, must-revalidate");
  }

  next();
});

// PINKIE AUDITOR PROXY
app.post(
  "/api/audit",
  requireAdmin,
  auditLimiter,
  async (req, res) => {
    const targetProjectId = "dollhouse-deviants";
    const location = "us-east1";
    const engineId = "7333900886940319744";

    const input = req.body?.input;

    if (typeof input !== "string") {
      return res.status(400).json({
        error: "invalid_input",
        message: "Input must be text.",
      });
    }

    const prompt = input.trim();

    if (prompt.length === 0 || prompt.length > 2000) {
      return res.status(400).json({
        error: "invalid_input",
        message: "Input must contain between 1 and 2000 characters.",
      });
    }

    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const url =
      `https://${location}-aiplatform.googleapis.com/v1/` +
      `projects/${targetProjectId}/locations/${location}/` +
      `reasoningEngines/${engineId}:query`;

    try {
      const client = await auth.getClient();

      const response = await client.request<any>({
        url,
        method: "POST",
        timeout: 30_000,
        data: {
          input: {
            class_method: "async_search_memory",
            input: prompt,
          },
        },
      });

      const resultData = response.data ?? {};
      let outputText = "Pinkie returned no usable response.";

      if (resultData.output !== undefined) {
        outputText =
          typeof resultData.output === "string"
            ? resultData.output
            : JSON.stringify(resultData.output);
      } else if (resultData.queryResult) {
        outputText =
          resultData.queryResult?.responseMessages?.find(
            (message: any) => message.text,
          )?.text?.text?.[0] ??
          resultData.queryResult?.fulfillmentText ??
          outputText;
      }

      return res.json({
        output: outputText,
      });
    } catch (error: any) {
      console.error("[Pinkie Audit] request failed", {
        status: error?.response?.status,
        message:
          error instanceof Error ? error.message : String(error),
      });

      return res.status(502).json({
        error: "upstream_unavailable",
        message: "Pinkie is temporarily unavailable.",
      });
    }
  },
);
  // STRIPE CHECKOUT (Boutique + Supporter). Test mode only for now.
  // No keys configured => /api/checkout answers 501 and the client keeps
  // the mailto fallback. No fulfillment is built yet (see stripeWebhook).
  app.get("/api/checkout/config", checkoutConfig);
  app.post("/api/checkout", checkoutLimiter, createCheckoutSession);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static assets with long-term caching
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res) => {
         res.set("Cache-Control", "public, max-age=31536000, immutable");
      }
    }));

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
