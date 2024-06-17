import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";

interface Props {
    children: ReactNode;
    user: User;
}

const ChatLayout = ({ children, user }: Props) => {
    return (
        <AuthenticatedLayout user={user}>
            <p> ChatLayout </p>
            <div>{children}</div>
        </AuthenticatedLayout>
    );
};

export default ChatLayout;
