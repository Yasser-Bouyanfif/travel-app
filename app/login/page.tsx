import Login from "@/components/Login/Login"
import {auth} from "@/lib/authOptions";
import {redirect} from "next/navigation";

const LoginPage = async () => {
    const session = await auth()

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div>
            <Login/>
        </div>
    )
}

export default LoginPage

