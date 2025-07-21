import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // Linking login page frontend to its backend with the help of mutation from tanstack so our login page actually functions
    const { isPending, error, loginMutation } = useLogin(); // useLogin is in hooks folder

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation(loginData);
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

                {/* LEFT SIDE - LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            Streamify
                        </span>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error.response.data.message}</span>
                        </div>
                    )}

                    {/* FORM TO SUBMIT LOGIN DETAILS */}
                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to your account to continue your language journey
                                    </p>
                                </div>

                                {/* INPUTS */}
                                <div className="flex flex-col gap-3">

                                    {/* EMAIL INPUT */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* PASSWORD INPUT */}
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* BUTTON TO SUBMIT */}
                                    <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    {/* LINK TO SIGNUP PAGE */}
                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                Create one
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE - ILLUSTRATION SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <a href="https://storyset.com/online"><img src="/i.png" alt="Language connection illustration" className="w-full h-full" /></a>
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                            <p className="opacity-70">
                                Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
