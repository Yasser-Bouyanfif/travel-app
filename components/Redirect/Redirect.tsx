"use client"

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";

const RedirectPage = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackURL");

    useEffect(() => {
        if (callbackUrl) {
            window.location.href = callbackUrl;
        }
    }, [callbackUrl])

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
        </div>
    )
}

export default RedirectPage;