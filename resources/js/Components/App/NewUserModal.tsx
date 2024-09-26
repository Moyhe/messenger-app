import { useEventBusContext } from "@/EventBus";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";

import Checkbox from "../Checkbox";

interface Props {
    show: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    email: string;
    is_admin: boolean;
}

const NewUserModal = ({ show = false, onClose }: Props) => {
    const { emit } = useEventBusContext();

    const { data, setData, processing, reset, post, put, errors } =
        useForm<FormData>({
            name: "",
            email: "",
            is_admin: false,
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("user.store"), {
            onSuccess: () => {
                emit("toast.show", `user "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={submit}
                className="p-6 overflow-y-auto sm:max-w-full"
            >
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Create New User
                </h2>

                <div className="mt-8 ">
                    <InputLabel htmlFor="name" value="name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div className="mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="is_admin"
                            checked={data.is_admin}
                            onChange={(e) =>
                                setData("is_admin", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Admin user
                        </span>
                    </label>
                    <InputError className="mt-2" message={errors.is_admin} />
                </div>

                <div className="mt-6 felx justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        create
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default NewUserModal;
