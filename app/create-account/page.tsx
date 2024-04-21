
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreateAccount() {
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form className="flex flex-col gap-3">
                <FormInput
                    type="text"
                    placeholder="Username"
                    required
                    errors={[]}
                />
                <FormInput type="text" placeholder="Email" required errors={[]} />
                <FormInput type="text" placeholder="Password" required errors={[]} />
                <FormInput type="text" placeholder="Confirm Password" required errors={[]} />
                <FormButton loading={false} text="Create account" />
            </form>
            <div className="w-full h-px bg-neutral-500" />
            <div>
                <Link
                    className="primary-btn h-10 gap-2"
                    href="/sms"
                >
                    <span>
                        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                    </span>
                    <span>Sign up with SMS</span>
                </Link>
            </div>
        </div>
    );
}