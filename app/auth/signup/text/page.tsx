"use client";

import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import app from "@/lib/firebase/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);

    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <div>
            {/* <Image alt="strart" /> */}
            <p>Login</p>
          </div>
          <div >
            <form onSubmit={handleLogin} >
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? <div ></div> : "Login"}
              </button>
            </form>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;