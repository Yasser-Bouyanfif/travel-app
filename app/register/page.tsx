import Register from "@/components/Register/Register"
import {auth} from "@/lib/authOptions";
import {redirect} from "next/navigation";

const RegisterPage = async () => {
    const session = await auth()

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div>
            <Register/>
        </div>
    )
}

export default RegisterPage

