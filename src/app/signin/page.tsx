"use client";
import { Typography, Stack, TextField, Button, Link } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";

export default function page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (!res?.error) {
        //redirect
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Typography variant="h1">This is Signin page</Typography>
      <Link href="/signup">Signup</Link>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Stack
          width={400}
          justifyContent="center"
          alignItems="center"
          margin="auto auto"
          spacing={1}
        >
          <TextField
            name="email"
            label="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            type="password"
            name="password"
            label="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button type="submit">Submit</Button>{" "}
        </Stack>
      </form>
    </>
  );
}
