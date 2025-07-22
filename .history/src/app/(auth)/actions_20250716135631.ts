"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export type SignupFormState = {
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};

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
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(
  prevState: SignupFormState, 
  formData: FormData
): Promise<SignupFormState> {
  // 1. Ambil data dari form
  const formObject = Object.fromEntries(formData.entries());

  // 2. Validasi dengan safeParse
  const validationResult = SignupSchema.safeParse(formObject);

  // 3. TANGANI JIKA VALIDASI GAGAL
  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.flatten());
    // Langsung return pesan error dan hentikan eksekusi
    return {
      message: "Input tidak valid. Silakan periksa kembali data Anda.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // 4. LANJUTKAN HANYA JIKA VALIDASI BERHASIL
  // Di blok ini, kita DIJAMIN bahwa validationResult.data ada isinya.
  const { name, email, password } = validationResult.data;

  const supabase = createClient();
  const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
          data: {
              full_name: name,
          },
      },
  });

  // 5. Tangani jika ada error dari Supabase
  if (signUpError) {
    return {
      message: `Gagal mendaftar: ${signUpError.message}`,
    };
  }

  // 6. Jika semua berhasil, baru revalidate dan redirect
  revalidatePath('/', 'layout');
  redirect('/');