import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)", 
  "/account(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { sessionClaims } = await auth();

  if (isProtectedRoute(req)) {
    auth.protect();
  }

  if (isAdminRoute(req)) {
    if (!['admin', 'manager'].includes((sessionClaims as any)?.publicMetadata?.role.toLowerCase())) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
