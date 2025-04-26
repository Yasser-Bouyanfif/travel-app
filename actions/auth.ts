"use server"

import {signIn, signOut} from "@/lib/authOptions"
import {revalidatePath} from "next/cache"

export async function login(provider: string) {
    await signIn(provider, {redirectTo: "/register"})
    revalidatePath("/")
}

export async function logout() {
    await signOut({redirectTo: "/"})
    revalidatePath("/")
}