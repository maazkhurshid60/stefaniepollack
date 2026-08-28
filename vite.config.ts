import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";
import { proxyIdxRequest } from "./api/_idxProxy.ts";
import { fetchPhoto } from "./api/_photoProxy.ts";
// import { readdyJsxRuntimeProxyPlugin } from "./vite.jsx-runtime-proxy";

const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;
//const proxyPlugins = isPreview ? [readdyJsxRuntimeProxyPlugin()] : [];

/** Mirrors api/idx.ts locally so `npm run dev` works without the Vercel CLI
 *  — same proxyIdxRequest() logic, just fed by a Connect middleware instead
 *  of a Vercel Function. Path travels as `?path=` (see api/idx.ts for why),
 *  matching the flat-file structure that's actually reliable in production. */
function idxDevProxyPlugin(): Plugin {
  return {
    name: "idx-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/idx", async (req, res) => {
        try {
          const topLevel = new URLSearchParams((req.url || "").split("?")[1] || "");
          const pathParam = topLevel.get("path") || "";
          const [path, embeddedQuery] = pathParam.split("?");
          const query = new URLSearchParams(embeddedQuery || "");
          for (const [k, v] of topLevel.entries()) {
            if (k === "path") continue;
            query.append(k, v);
          }

          let jsonBody: Record<string, unknown> | undefined;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const raw = Buffer.concat(chunks).toString("utf8");
            if (raw) {
              try {
                jsonBody = JSON.parse(raw);
              } catch {
                jsonBody = undefined;
              }
            }
          }

          const result = await proxyIdxRequest({ method: req.method || "GET", path, query, jsonBody });
          res.statusCode = result.status;
          res.setHeader("Content-Type", result.contentType);
          res.end(result.body);
        } catch (err) {
          // A network hiccup (e.g. a transient DNS failure) here must not
          // crash the whole dev server — surface it as a failed request instead.
          console.error("[idx-dev-proxy]", err);
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "IDX upstream request failed" }));
        }
      });
    },
  };
}

/** Mirrors api/photo.ts locally — see api/_photoProxy.ts for why this exists. */
function photoDevProxyPlugin(): Plugin {
  return {
    name: "photo-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/photo", async (req, res) => {
        try {
          const query = new URLSearchParams((req.url || "").split("?")[1] || "");
          const url = query.get("url") || "";
          const result = await fetchPhoto(url);
          if (!result.ok) {
            res.statusCode = result.status;
            res.end();
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", result.contentType);
          res.end(Buffer.from(result.body));
        } catch (err) {
          console.error("[photo-dev-proxy]", err);
          res.statusCode = 502;
          res.end();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.local (and friends) into process.env for this config module —
  // Vite only auto-exposes VITE_-prefixed vars to client code, not to the
  // config file itself, so IDX_BROKER_ACCESS_KEY needs an explicit loadEnv().
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
    __READDY_PROJECT_ID__: JSON.stringify(process.env.PROJECT_ID || ""),
    __READDY_VERSION_ID__: JSON.stringify(process.env.VERSION_ID || ""),
    __READDY_AI_DOMAIN__: JSON.stringify(process.env.READDY_AI_DOMAIN || ""),
  },
  plugins: [
    // ...proxyPlugins,
    react(),
    idxDevProxyPlugin(),
    photoDevProxyPlugin(),
    AutoImport({
      imports: [
        {
          react: [
            ["default", "React"],
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
        // React i18n
        {
          "react-i18next": ["useTranslation", "Trans"],
        },
      ],
      dts: true,
    }),
  ],
  base,
  build: {
    sourcemap: true,
    outDir: 'out',
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  };
});
