import { Navbar } from "@/components/navbar";
import { HomeContent } from "@/components/home-content";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();
    return (
        <div>
            <Navbar />
            <HomeContent isLoggedIn={!!session?.user} />
        </div>
    );
}
