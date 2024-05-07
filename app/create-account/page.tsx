import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

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
                    name="name"
                />
                <FormInput type="text" placeholder="Email" required errors={[]} name="email" />
                <FormInput type="text" placeholder="Password" required errors={[]} name="password" />
                <FormInput type="text" placeholder="Confirm Password" required errors={[]} name="confirm" />
                <FormButton text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}