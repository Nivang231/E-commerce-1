import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/slices/authSlice";
import { toast } from "sonner";

const ForgotPassword = () => {
    console.log("ENV VALUE:", import.meta.env.VITE_BACKEND_URL);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(forgotPassword(email));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Reset link sent!");
    } else {
      toast.error(res.payload?.message);
    }
    
  };

  console.log("BUTTON CLICKED");

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
  >
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
      Forgot Password
    </h2>

    <p className="text-sm text-gray-500 text-center mb-6">
      Enter your email and we’ll send you a reset link
    </p>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Email Address
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
    >
      Send Reset Link
    </button>
  </form>
</div>
  );
};

export default ForgotPassword;