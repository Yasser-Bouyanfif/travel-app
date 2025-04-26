import type {Metadata} from "next"
import {Poppins} from "next/font/google"
import "./globals.css"
import Footer from "@/components/Home/Footer/Footer"
import ScrollToTop from "@/components/Helper/ScrollToTop"
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav"
import {auth} from "@/lib/authOptions"
import {SessionProvider} from "next-auth/react"
import {Toaster} from "sonner";

const font = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: "Travel for You | Next js 15",
    description: "Travel Landing page using next",
}

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <html lang="en">
        <body className={`${font.className} antialiased`}>
        <SessionProvider session={session}>
            <ResponsiveNav/>
            {children}
            <Footer/>
            <ScrollToTop/>
            <Toaster closeButton richColors/>
        </SessionProvider>
        </body>
        </html>
    )
}