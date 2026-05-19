import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except Next internals, static assets, and api routes (so /api/health bypasses locale rewriting)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
