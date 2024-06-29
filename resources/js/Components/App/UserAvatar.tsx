import { User } from "@/types";

interface Props {
    user: User;
    online: () => boolean;
    profile: boolean;
}

const UserAvatar = ({ user, online, profile }: Props) => {
    const onlineClass =
        online() == true ? "online" : online() == false ? "offline" : "";

    const sizeClass = profile ? "w-40" : "w-10";

    return (
        <>
            {user.avatar && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar} />
                    </div>
                </div>
            )}

            {!user.avatar && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div
                        className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}`}
                    >
                        <span className="text-xl">
                            {user.name.substring(0, 1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
