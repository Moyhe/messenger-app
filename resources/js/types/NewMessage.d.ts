import { User } from ".";

export default interface Notification {
    message: string;
    uuid: string;
    user: User;
    group_id: number;
}
