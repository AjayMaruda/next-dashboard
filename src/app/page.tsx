import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/config/navigation";

export default function Home() {
  redirect(APP_ROUTES.DASHBOARD);
}
