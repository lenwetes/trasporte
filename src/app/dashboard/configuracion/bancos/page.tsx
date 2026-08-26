import { redirect } from "next/navigation";

export default function RedirectBancos() {
    redirect("/dashboard/finance/settings");
}
