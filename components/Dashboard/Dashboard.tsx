"use client";

import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")
    const router = useRouter()

    const [data, setData] = useState<UserDataType | null>(null)

    const [profileFormData, setProfileFormData] = useState({
        address: "",
        postalCode: "",
        city: "",
        country: ""
    })
    const [profileRedInputs, setProfileRedInputs] = useState({
        address: false,
        postalCode: false,
        city: false,
        country: false
    })

    type UserDataType = {
        userData: {
            _id: string
            name?: string
            email?: string
            address?: string
            postalCode?: string;
            city?: string;
            country?: string;
        }
    }

    const userDatas = data?.userData

    useEffect(() => {
        const getInfos = async () => {
            try {
                const res = await fetch("/api/auth/userInfos")

                if (!res.ok) {
                    toast.error("User not found.")
                    router.push("/login")
                }

                const datas = await res.json()
                setData(datas)

            } catch (error) {
                console.log(error)
            }
        }
        getInfos()
    }, [])
    useEffect(() => {
        if (userDatas) {
            setProfileFormData({
                address: userDatas.address || "",
                postalCode: userDatas.postalCode || "",
                city: userDatas.city || "",
                country: userDatas.country || ""
            });
        }
    }, [userDatas]);


    const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setProfileFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (profileRedInputs[name as keyof typeof profileRedInputs]) {
            setProfileRedInputs(prev => ({
                ...prev,
                [name]: false
            }))
        }
    }

    const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newProfileRedInputs = {
            address: !profileFormData.address,
            postalCode: !profileFormData.postalCode,
            city: !profileFormData.city,
            country: !profileFormData.country,

        }

        if (Object.values(newProfileRedInputs).some(Boolean)) {
            toast.error("Please fill in all the required fields.")
            setProfileRedInputs(newProfileRedInputs)
            return
        }

        try {
            const resUserExists = await fetch('api/auth/userExists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: userDatas?.email})
            })

            const {user} = await resUserExists.json()

            if (!user) {
                toast.error("We were unable to authenticate you.")
                return
            }

            const res = await fetch('api/auth/updateProfile', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({...profileFormData})
            })

            if (res.ok) {
                toast.success("Your information has been successfully recorded.")
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    //////////////////////////////PASSWORD CHANGE//////////////////////////////////////////////

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    })

    const [passwordRedInputs, setPasswordRedInputs] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    })


    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setPasswordFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (passwordRedInputs[name as keyof typeof passwordRedInputs]) {
            setPasswordRedInputs(prev => ({
                ...prev,
                [name]: false
            }))
        }
    }

    const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newPasswordRedInputs = {
            currentPassword: !passwordFormData.currentPassword,
            newPassword: !passwordFormData.newPassword,
            confirmNewPassword: !passwordFormData.confirmNewPassword
        }

        if (Object.values(newPasswordRedInputs).some(Boolean)) {
            toast.error("Please fill in all the required fields.")
            setPasswordRedInputs(newPasswordRedInputs)
            return
        }

        try {
            const resUserExists = await fetch('api/auth/userExists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: userDatas?.email})
            })

            const {user} = await resUserExists.json()

            if (!user) {
                toast.error("We were unable to authenticate you.")
                return
            }

            if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
                toast.error("Passwords do not match.")
                setPasswordRedInputs(prev => ({
                    ...prev,
                    newPassword: true,
                    confirmNewPassword: true
                }))
                return
            }

            const res = await fetch("api/auth/updatePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...passwordFormData})
            })

            if (res.status === 422) {
                toast.error("Your current password is incorrect.")
                setPasswordRedInputs(prev => ({
                    ...prev,
                    currentPassword: true,
                }))
                return
            }

            if (res.ok) {
                setPasswordFormData(() => ({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                }))
                toast.success("Your new password has been saved successfully.")
                return
            } else {
                toast.error("Failed to update password")
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 pt-32">
            <div
                className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg border-2 border-double border-gray-300 p-10">

                <div className="flex justify-center mb-8 space-x-4">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            activeTab === "profile"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                        } cursor-pointer`}
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            activeTab === "password"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                        } cursor-pointer`}
                    >
                        Update Password
                    </button>
                </div>

                {activeTab === "profile" ? (

                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-center mb-4 uppercase">Update Profile</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={userDatas?.email ?? ""}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={userDatas?.name ?? ""}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                onChange={handleProfileChange}
                                type="text"
                                placeholder="123 Main St"
                                className={`w-full px-4 py-2 border rounded-lg ${profileRedInputs.address ? "border-red-500" : ""}`}
                                name="address"
                                value={profileFormData.address}
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                            <input
                                onChange={handleProfileChange}
                                type="text"
                                placeholder="75000"
                                className={`w-full px-4 py-2 border rounded-lg ${profileRedInputs.postalCode ? "border-red-500" : ""}`}
                                name="postalCode"
                                value={profileFormData.postalCode}
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                onChange={handleProfileChange}
                                type="text"
                                placeholder="Paris"
                                className={`w-full px-4 py-2 border rounded-lg ${profileRedInputs.city ? "border-red-500" : ""}`}
                                name="city"
                                value={profileFormData.city}
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <select onChange={handleProfileChange}
                                    className={`w-full px-4 py-2 border rounded-lg ${profileRedInputs.country ? "border-red-500" : ""}`}
                                    name="country"
                                    value={profileFormData.country}>
                                <option value="" disabled hidden>Select a country</option>
                                <option value="usa">USA</option>
                                <option value="france">France</option>
                                <option value="italy">Italy</option>
                                <option value="germany">Germany</option>
                                <option value="china">China</option>
                                <option value="canada">Canada</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-center mb-4 uppercase">Update Password</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                onChange={handlePasswordChange}
                                type="password"
                                name="currentPassword"
                                placeholder="********"
                                className={`w-full px-4 py-2 border rounded-lg ${passwordRedInputs.currentPassword ? "border-red-500" : ""}`}
                                value={passwordFormData.currentPassword}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                onChange={handlePasswordChange}
                                type="password"
                                name="newPassword"
                                placeholder="New password"
                                className={`w-full px-4 py-2 border rounded-lg ${passwordRedInputs.newPassword ? "border-red-500" : ""}`}
                                value={passwordFormData.newPassword}
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                onChange={handlePasswordChange}
                                type="password"
                                name="confirmNewPassword"
                                placeholder="Confirm new password"
                                className={`w-full px-4 py-2 border rounded-lg ${passwordRedInputs.confirmNewPassword ? "border-red-500" : ""}`}
                                value={passwordFormData.confirmNewPassword}
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
