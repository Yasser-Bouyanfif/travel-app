"use client";

import {XCircle} from "lucide-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const CancelPage = () => {
    const session = useSession()
    const router = useRouter()

    if (session.status === "unauthenticated") {
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6"/>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Transaction Failed</h1>
                <p className="text-gray-600 mb-6">
                    The transaction could not be completed. Please try again or contact support.
                </p>
                <a
                    href="/"
                    className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Back to Home
                </a>
            </div>
        </div>
    );
};

export default CancelPage