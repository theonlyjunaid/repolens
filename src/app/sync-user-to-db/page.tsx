import { db } from "@/server/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const SyncUserToDB = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Redirect unauthenticated users to the login page
  if (!user || !user.email) {
    return redirect("/api/auth/login?post_login_redirect_url=/sync-user-to-db");
  }

  // Sync user data to the database
  await db.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      firstName: user.given_name,
      lastName: user.family_name,
      imageUrl: user.picture,
    },
    create: {
      id: user.id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      imageUrl: user.picture,
    },
  });

  // Redirect to the dashboard after syncing
  return redirect("/dashboard");
};

export default SyncUserToDB;