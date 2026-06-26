import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in and trying to access protected routes, redirect to login
  const protectedPaths = ["/home", "/work", "/templates"];
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and on login page, redirect to home
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/home", "/work/:path*", "/templates", "/login"],
};
