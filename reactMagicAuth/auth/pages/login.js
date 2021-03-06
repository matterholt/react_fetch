import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Magic } from "magic-sdk";

import useUser from "../hooks/useUser";

export default function Login() {
  useUser({ redirectTo: "/dashboard", redirectIfFound: true });
  const [errorMg, setErrorMsg] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      email: event.currentTarget.email.value,
    };
    // authentication magic link keys
    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY);
      const DID_Token = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      // authorization got the keys an need to do something with it
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + DID_Token,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        // update status for users,
        router.push("/dashboard");
      } else if (res.status === 500) {
        alert("error on 500");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      setErrorMsg(error.message);
    }
  };
  return (
    <div>
      <h2>The Login Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" />
        <button>Log In</button>
      </form>
    </div>
  );
}
