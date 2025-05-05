"use client"

import {ChangeEvent, FormEvent, useState} from "react"
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {toast} from "sonner";

const Register = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: null as string | null,
        postalCode: null as string | null,
        city: null as string | null,
        country: null as string | null
    })
    const [redInputs, setRedInputs] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (redInputs[name as keyof typeof redInputs]) {
            setRedInputs(prev => ({
                ...prev,
                [name]: false
            }))
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newRedInputs = {
            name: !formData.name,
            email: !formData.email,
            password: !formData.password,
            confirmPassword: !formData.confirmPassword
        }

        if (Object.values(newRedInputs).some(Boolean)) {
            toast.error("Please fill in all the required fields.")
            setRedInputs(newRedInputs)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.")
            setRedInputs(prev => ({
                ...prev,
                password: true,
                confirmPassword: true
            }))
            return
        }


        const loadingToast = toast.loading("Creating your account...")
        try {
            const resUserExists = await fetch('api/auth/userExists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: formData.email})
            })

            const {user} = await resUserExists.json()

            if (user) {
                toast.error("This email address is already in use.")
                setRedInputs(prev => ({
                    ...prev,
                    email: true
                }))
                return
            }

            const res1 = await fetch("api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    address: null,
                    postalCode: null,
                    city: null,
                    country: null
                })
            })

            if (res1?.ok) {
                toast.success("Account successfully created!", {id: loadingToast})

                const res2 = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                })

                if (res2?.ok) {
                    if (callbackUrl) {
                        window.location.href = callbackUrl;
                        toast.dismiss(loadingToast)
                    } else {
                        router.push("/dashboard")
                        toast.dismiss(loadingToast)
                    }

                } else {
                    toast.error("Registration failed. Please contact customer support.")
                    toast.dismiss(loadingToast)
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} method="POST">
            <div className="min-h-screen flex items-center justify-center bg-[#ede4e4] border-b-1">
                <div
                    className="border-2 border-double border-gray-300 rounded shadow-md rounded-lg p-8 w-full max-w-md bg-white">
                    <h1 className="text-2xl font-semibold text-center mb-6 uppercase">Signup</h1>
                    <div className="flex flex-col gap-5 mt-10">
                        <input
                            onChange={handleChange}
                            type="text"
                            placeholder="Name"
                            className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${redInputs.name ? "border-red-500" : ""}`}
                            name="name"
                            value={formData.name}
                            minLength={2}
                        />
                        <input
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${redInputs.email ? "border-red-500" : ""}`}
                            name="email"
                            value={formData.email}
                        />
                        <input
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${redInputs.password ? "border-red-500" : ""}`}
                            name="password"
                            value={formData.password}
                            minLength={6}
                        />
                        <input
                            onChange={handleChange}
                            type="password"
                            placeholder="Confirm password"
                            className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${redInputs.confirmPassword ? "border-red-500" : ""}`}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            minLength={6}
                        />
                        <button
                            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 transition cursor-pointer">
                            Signup
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Register