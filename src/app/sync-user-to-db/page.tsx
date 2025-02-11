import { db } from "@/server/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    notFound(); // Correct way to trigger a 404 page
  }

  if (!user.email) {
    notFound();
  }

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

  redirect("/dashboard"); // Correct way to handle redirection
};

export default SyncUser;
