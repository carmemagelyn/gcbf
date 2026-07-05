import { onRequest as __newsletter__slug__js_onRequest } from "/Users/carmemagelyn/Documents/GitHub/gcbf/functions/newsletter/[slug].js"
import { onRequest as __api___path___js_onRequest } from "/Users/carmemagelyn/Documents/GitHub/gcbf/functions/api/[[path]].js"

export const routes = [
    {
      routePath: "/newsletter/:slug",
      mountPath: "/newsletter",
      method: "",
      middlewares: [],
      modules: [__newsletter__slug__js_onRequest],
    },
  {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___path___js_onRequest],
    },
  ]