import { Navbar } from "@/components/layout/Navbar";
import { UserProfile } from "@/components/profile/UserProfile";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-trench pl-4">
                    PERFIL DE AGENTE
                </h1>

                <UserProfile />
            </div>
        </main>
    );
}
