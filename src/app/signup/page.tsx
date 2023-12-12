"use client";

import {
  SignupRequestType,
  signupRequestValidator,
} from "@/validators/authenticationValidators";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

export default function SignUp() {
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupRequestType>({
    resolver: zodResolver(signupRequestValidator),
  });
  async function onSubmit(data: SignupRequestType) {
    let x = await axios.post("http://localhost:3000/api/signup", data);
    console.log(x);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center gap-4 text-lg flex-col h-screen dark:text-black">
          <label htmlFor="name" className="text-white">
            Name
          </label>
          <input
            id={"name"}
            type={"text"}
            className="dark:rounded-lg"
            {...register("name")}
          ></input>
          {errors.name && <p className="text-white">{errors.name.message}</p>}

          <label htmlFor="userName" className="text-white">
            User Name
          </label>
          <input
            id={"userName"}
            type={"text"}
            className="dark:rounded-lg"
            {...register("userName")}
          ></input>
          {errors.userName && (
            <p className="text-white">{errors.userName.message}</p>
          )}

          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            id={"email"}
            type={"text"}
            className="dark:rounded-lg"
            {...register("email")}
          ></input>
          {errors.email && <p className="text-white">{errors.email.message}</p>}

          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            id={"password"}
            type={"password"}
            className="dark:rounded-lg"
            {...register("password")}
          ></input>
          {errors.password && (
            <p className="text-white">{errors.password.message}</p>
          )}

          <button className="bg-gray-400 px-6 rounded-xl">Submit</button>
        </div>
      </form>
    </>
  );
}
