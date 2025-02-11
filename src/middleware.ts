import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest , NextResponse} from "next/server";
export default function middleware(req : NextRequest) {


  if (req.nextUrl.pathname === "/sync-user-to-db") {
    return NextResponse.next();
  }
  return withAuth(req, {
    isReturnToCurrentPage: true,
    loginPage: "/",
  });
}
export const config = {
  matcher: []
};


