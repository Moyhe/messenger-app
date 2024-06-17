import ChatLayout from "@/Layouts/ChatLayout";
import { PageProps } from "@/types";

export default function Home({ auth }: PageProps) {
    return (
        <ChatLayout user={auth.user}>
            <div> Messages </div>
        </ChatLayout>
    );
}
