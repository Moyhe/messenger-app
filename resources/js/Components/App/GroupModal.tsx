import { useEventBusContext } from "@/EventBus";
import { PageProps, User } from "@/types";
import {
    Conversation,
    ConversationProps,
    UserGroup,
} from "@/types/conversations";
import { useForm, usePage } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import TextAreaInput from "../TextAreaInput";
import UserPicker from "./UserPicker";

interface Props {
    show: boolean;
    onClose: () => void;
}

interface FormData {
    id: string;
    name: string;
    description: string;
    user_ids: number[];
}

const GroupModal = ({ show = false, onClose }: Props) => {
    const { conversations } = usePage<ConversationProps>().props;

    const { emit, on } = useEventBusContext();

    const [group, setGroup] = useState<UserGroup>({} as UserGroup);

    const { data, setData, processing, reset, post, put, errors } =
        useForm<FormData>({
            id: "",
            name: "",
            description: "",
            user_ids: [],
        });

    const users = conversations.filter((c) => !c.is_group);

    const createOrUpdateGroup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (group?.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("tost.show", `Group "${group.name}" was updated`);
                },
            });
            return;
        }

        post(route("group.store"), {
            onSuccess: () => {
                emit("toast.show", `Group "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    const handleGroupModalShow = (group: UserGroup) => {
        setData({
            id: String(group.id),
            name: group.name,
            description: group.description,
            user_ids: group.users
                .filter((u) => group.owner_id !== u.id)
                .map((u) => u.id),
        });

        setGroup(group);
    };

    useEffect(() => {
        const offShowModal = on("GroupModal.show", handleGroupModalShow);

        return () => {
            offShowModal();
        };
    }, [on]);

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 overflow-y-auto"
            >
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {group.id ? `Group ${group.name}` : "create new group"}
                </h2>

                <div className="mt-8 ">
                    <InputLabel htmlFor="name" value="name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="description" />

                    <TextAreaInput
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div className="mt-4">
                    <InputLabel value="select users..." />

                    <UserPicker
                        value={
                            Array.isArray(users)
                                ? users.filter(
                                      (u) =>
                                          group.owner_id !== u.id &&
                                          data.user_ids.includes(u.id)
                                  )
                                : []
                        }
                        options={users || []}
                        onSelect={(selectedUsers) => {
                            setData(
                                "user_ids",
                                selectedUsers.map((u) => u.id)
                            );
                        }}
                    />

                    <InputError className="mt-2" message={errors.user_ids} />
                </div>

                <div className="mt-6 felx justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default GroupModal;
