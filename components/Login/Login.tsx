"use client";
import Link from "next/link";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRedInput, setEmailRedInput] = useState(false);
  const [passwordRedInput, setPasswordRedInput] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please fill in all the required fields.");
      setEmailRedInput(true);
      return;
    }

    if (!password) {
      toast.error("Please fill in all the required fields.");
      setPasswordRedInput(true);
      return;
    }

    const loadingToast = toast.loading("Signin in...");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.dismiss(loadingToast);

      if (res?.error) {
        toast.error("Invalid email or password.");
        return;
      } else if (callbackUrl) {
        window.location.href = callbackUrl;
        return;
      } else {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} method="POST" ref={formRef}>
        <div className="min-h-screen flex items-center justify-center bg-[#ede4e4] border-b-1">
          <div className="border-2 border-double border-gray-300 rounded shadow-md rounded-lg p-8 w-full max-w-md bg-white">
            <h1 className="text-2xl font-semibold text-center mb-6 uppercase">
              Login
            </h1>
            <div className="flex flex-col gap-5 mt-10">
              <input
                onChange={handleEmailChange}
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${emailRedInput ? "border-red-500" : ""}`}
              />
              <input
                onChange={handlePasswordChange}
                type="password"
                name="password"
                placeholder="Password"
                className={`rounded-2xl p-3 border-2 border-gray-400 rounded ${passwordRedInput ? "border-red-500" : ""}`}
              />
              <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 transition cursor-pointer">
                Login
              </button>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() =>
                    signIn("github", {
                      callbackUrl: callbackUrl
                        ? `/redirect?callbackURL=${encodeURIComponent(callbackUrl)}`
                        : "/dashboard",
                    })
                  }
                  className="flex-1 bg-[#8c8c8c] text-white py-2 px-4 rounded hover:bg-[#808080] transition cursor-pointer"
                >
                  Login with Github
                </button>
                <button
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: callbackUrl
                        ? `/redirect?callbackURL=${encodeURIComponent(callbackUrl)}`
                        : "/dashboard",
                    })
                  }
                  className="flex-1 bg-[#ff4d4d] text-white py-2 px-4 rounded hover:bg-[#ff3333] transition cursor-pointer"
                >
                  Login with Google
                </button>
              </div>
              <Link
                href={
                  callbackUrl
                    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : "/register"
                }
              >
                <p className="my-3 text-center underline text-gray-800 hover:text-gray-600">
                  Don&apos;t you have an account?
                </p>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
