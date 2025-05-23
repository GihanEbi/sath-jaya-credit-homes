import LoginWithPassword from "@/components/LigninWithPassword/LoginWithPassword";
import React from "react";

const Login = () => {
  return (
    <>
      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Login with email and password
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <LoginWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          {/* <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link> */}
        </p>
      </div>
    </>
  );
};

export default Login;
