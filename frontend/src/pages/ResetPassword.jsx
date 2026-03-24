import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../redux/slices/authSlice";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(resetPassword({ token, password }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password updated");
      navigate("/login");
    } else {
      toast.error(res.payload?.message);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
  >
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      Reset Password
    </h2>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        New Password
      </label>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
    >
      Reset Password
    </button>
  </form>
</div>
  );
};

export default ResetPassword;