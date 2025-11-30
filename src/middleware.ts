import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware((auth, req) => {
  const matched = matchers.find(({ matcher }) => matcher(req));

  // Route is not protected by our map.
  if (!matched) return NextResponse.next();

  const { sessionId, sessionClaims } = auth();

  // No session: send to Clerk sign-in.
  if (!sessionId) return auth().redirectToSignIn();

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Missing role metadata: force sign-in to refresh claims.
  if (!role) return auth().redirectToSignIn();

  // Role mismatch: redirect to the user’s own home instead of looping.
  if (!matched.allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
