import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function LogIn() {
    const handleForm = async (formData: FormData) => {
        "use server";
        console.log("i run in the server only baby",
            formData.get("email"), formData.get("password"));
    }
    const onClick = async () => {
        const response = await fetch("/www/users", {
            method: "POST",
            body: JSON.stringify({
                username: "kim",
                password: "1234",
            }),
        });
        console.log(await response.json());
    }
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form action={handleForm} className="flex flex-col gap-3">
                <FormInput type="text" placeholder="Email" required errors={[]} name="email" />
                <FormInput type="text" placeholder="Password" required errors={[]} name="password" />
                <FormButton loading={false} text="Log in" />
            </form>
            <SocialLogin />
        </div>
    );
}