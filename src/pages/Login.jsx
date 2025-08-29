import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { login } from "../api_utils/api_routes";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setAlert(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-full h-full lg:h-fit lg:w-fit bg-p-black gap-5 text-white lg:rounded-2xl px-3 lg:px-14 lg:py-10 flex flex-col items-center justify-center">

        <div className="text-center space-y-1">
          <div className="text-4xl mb-2">Welcome back!</div>
          <div className="text-lg text-p-darkgray">
            login to continue to dashboard
          </div>
        </div>

        <div className="w-full lg:w-[320px] px-5 lg:px-0 my-5">
          <form className="w-full space-y-3" onSubmit={handleSubmit}>
            <input
              className="border border-[#2c2c2e] w-full rounded-xl px-5 py-3 outline-white"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border border-[#2c2c2e] w-full rounded-xl px-5 py-3 outline-white"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className={`border ${
                !alert ? "bg-white hover:bg-gray-100" : "bg-red-600 hover:bg-red-700"
              } text-black font-semibold w-full rounded-xl px-5 py-3 outline-white text-sm`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <BarLoader className="my-1" />
              ) : alert ? (
                <div className="text-white w-full truncate">Invalid email or password</div>
              ) : (
                <div>login</div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
