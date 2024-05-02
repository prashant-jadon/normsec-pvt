
import { z } from "zod"

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters.", }).max(80),
    username: z.string().min(2, { message: "Username must be at least 2 characters.", }).max(80),
    email: z.string().min(2, { message: "Email must be at least 2 characters.", }).max(80),
    password: z.string().min(8, { message: "Password must be at least 8 characters.", }).max(80),
  })

  export const SignInValidation = z.object({
      email: z.string().min(2, { message: "Email must be at least 2 characters.", }).max(80),
      password: z.string().min(8, { message: "Password must be at least 8 characters.", }).max(80),
    })

export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.optional(z.array(z.instanceof(File))), 
  location: z.string().min(0).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});