// pages/signup.js
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function Signup() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-12 bg-gradient-to-b from-[#e9f3f4] to-[#ffffff] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">SIGN UP</h2>

        <div className="bg-white p-12 w-full max-w-md max-h-[600px] rounded-xl shadow-xl">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 mb-5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4db6ac] transition"
          />
          <button className="w-full bg-[#4db6ac] hover:bg-[#39998d] text-white py-2.5 rounded font-semibold transition duration-300 mb-5">
            Sign Up
          </button>

          <div className="flex gap-3 mb-5">
            <button className="flex-1 border border-gray-300 hover:border-[#4db6ac] hover:text-[#4db6ac] flex items-center justify-center gap-2 py-2 rounded text-sm transition">
              <FaGoogle /> Sign up with Google
            </button>
            <button className="flex-1 border border-gray-300 hover:border-[#4db6ac] hover:text-[#4db6ac] flex items-center justify-center gap-2 py-2 rounded text-sm transition">
              <FaFacebookF /> Sign up with Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a className="underline text-[#4db6ac] hover:text-[#39998d]" href="/login">
              Log In
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
