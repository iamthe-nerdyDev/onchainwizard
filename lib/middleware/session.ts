import { getServerSession } from "next-auth";
import { authOptions } from "../nextauth";

export default async function () {
  const session = await getServerSession(authOptions);
  if (!session) return undefined;

  return Number(session.user.id);
}
