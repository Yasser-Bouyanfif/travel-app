"use client"

import DashboardPage from "@/components/Dashboard/Dashboard";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const Dashboard = () => {
    const session = useSession()
    const router = useRouter()

    if (session.status === "unauthenticated") {
        router.push("/login")
    }

    return (
        <div>
            <DashboardPage/>
        </div>
    )
}

export default Dashboard;