'use client'
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {  Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof FormSchema>;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function Login() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
  try {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.message || 'Erro ao fazer login');
      return;
    }

    const user = await res.json();
    console.log('Login bem-sucedido:', user);

    if (res.ok) {
  router.push('/page1'); // ou qualquer rota que quiser
}

  } catch (err) {
    console.error(err);
    alert('Erro de conexão com o servidor');
  }
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-400">
      <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-white">
        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Login</FieldLegend>
              <FieldGroup>
                <Controller 
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="text" {...field} />
                    {fieldState.error && (<span className="text-sm text-red-600">{fieldState.error.message}</span>)}
                  </Field>
                  )}
                />
                <Controller 
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" {...field} />
                    {fieldState.error && (<span className="text-sm text-red-600">{fieldState.error.message}</span>)}
                  </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
          <Field orientation="horizontal" className="mt-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </Field>
        </form>
      </div>
    </main>
  )
}