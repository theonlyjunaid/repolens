import { db } from "@/server/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user || user == null || !user.id) {
      throw new Error("something went wrong with authentication" + user);
    }

    // console.log("hello")
    // console.log(user)
  
    // check if user exists in your database
    const dbUser = await db.user.findUnique({
        where: {
            id: user.id,
        },
        });
  
    // Only create new user if they don't exist
    if (!dbUser && user.email) {
      /* create new user in your database */
    //   const dbUser = await db.user.create({
    //     data:{
    //         id : user.id,
    //         email : user?.email
    //     }
    //   })
    }
  
    return NextResponse.redirect("https://repolens.vercel.app/");
  }