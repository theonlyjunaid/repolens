import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default async function Home() {

  
  return (
 <>
  <LoginLink postLoginRedirectURL="http://localhost:3000/sync-user-to-db">Sign In</LoginLink>
  <RegisterLink postLoginRedirectURL="http://localhost:3000/sync-user-to-db">Sign Up</RegisterLink>

  <LogoutLink>Log out</LogoutLink>
 </>
  );
}
