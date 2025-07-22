// File: app/login/actions.ts (atau di mana pun actions Anda berada)

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server"; // <-- Ini akan menggunakan server.ts
import { cookies } from "next/headers"; // <-- Import 'cookies' dari next/headers

// ... (Tipe SignupFormState Anda sudah benar)
export type SignupFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

// ... (Skema Zod Anda sudah benar)
const SignupSchema = z
  .object({
    name: z.string().min(2, { message: "Nama lengkap harus diisi." }),
    email: z.string().email({ message: "Alamat email tidak valid." }),
    password: z
      .string()
      .min(8, { message: "Password harus memiliki minimal 8 karakter." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok.",
    path: ["confirmPassword"],
  });

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // PERBAIKAN DI SINI:
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    // Redirect ke halaman login lagi dengan pesan error
    return redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const formObject = Object.fromEntries(formData.entries());
  const validationResult = SignupSchema.safeParse(formObject);

  if (!validationResult.success) {
    return {
      message: "Input tidak valid. Silakan periksa kembali data Anda.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validationResult.data;

  // PERBAIKAN DI SINI:
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (signUpError) {
    return {
      message: `Gagal mendaftar: ${signUpError.message}`,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login?message=Check email to continue sign in process');
}p>

