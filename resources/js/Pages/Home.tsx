import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";

export default function Home() {
    return (
        <AuthenticatedLayout>
            <ChatLayout>messages</ChatLayout>
        </AuthenticatedLayout>
    );
}
