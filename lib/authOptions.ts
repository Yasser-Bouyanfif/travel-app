import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import {connectMongoDB} from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import CustomMongoDBAdapter from "@/lib/customMongoDbAdapter";
import clientPromise from "@/lib/mongoClient";

export const {handlers, signIn, signOut, auth} = NextAuth({

    adapter: CustomMongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
        signOut: "/"
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                name: {type: "text"},
                email: {type: "text"},
                password: {type: "password"}
            },

            async authorize(credentials: any): Promise<any> {
                const {email, password} = credentials as {
                    email: string,
                    password: string
                }

                try {
                    await connectMongoDB()
                    const user = await User.findOne({email})

                    if (!email || !password) return null
                    if (!user) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    console.log(passwordsMatch)

                    if (!passwordsMatch) return null

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })
    ]
})