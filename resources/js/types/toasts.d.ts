import { User } from ".";

export default interface Toasts {
    message: string;
    uuid: string;
    user?: User;
    group_id?: number;
}
