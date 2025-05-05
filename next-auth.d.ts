import "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
        address?: string | null
        postalCode?: string | null
        city?: string | null
        country?: string | null
    }

    interface Session {
        user: User
    }
}