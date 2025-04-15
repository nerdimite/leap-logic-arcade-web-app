import { redirect } from "next/navigation";

export default function VotePage() {
  redirect("/dashboard/pubg/mission");

  // The code below won't execute due to the redirect
  return null;
}
