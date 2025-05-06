// pages/login.js
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-12 bg-gradient-to-b from-[#e9f3f4] to-[#ffffff] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">LOGIN</h2>

        <div className="bg-white p-12 w-full max-w-md max-h-[500px] rounded-xl shadow-xl">


          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
          />
          <button className="w-full bg-[#4db6ac] hover:bg-[#39998d] text-white py-2.5 rounded font-semibold transition duration-300 mb-5">
            Sign In
          </button>

          <div className="flex gap-3 mb-5">
            <button className="flex-1 border border-gray-300 hover:border-[#4db6ac] hover:text-[#4db6ac] flex items-center justify-center gap-2 py-2 rounded text-sm transition">
              <FaGoogle /> Sign in with Google
            </button>
            <button className="flex-1 border border-gray-300 hover:border-[#4db6ac] hover:text-[#4db6ac] flex items-center justify-center gap-2 py-2 rounded text-sm transition">
              <FaFacebookF /> Sign in with Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a className="underline text-[#4db6ac] hover:text-[#39998d]" href="/signup">
              Sign Up
            </a>
          </p>
        </div>

        {/* Spacer to push footer out of view */}
        <div className="h-48"></div>
      </main>

      <Footer />
    </div>
  );
}
