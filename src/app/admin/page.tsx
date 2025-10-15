import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Admin() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/auth/sign-in");
  } else {
    redirect("/admin/products");
  }
}
