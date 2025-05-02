import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"; // Importando o Toaster

export const metadata: Metadata = {
  title: "Furia Fan Zone", // Título atualizado
  description: "Acompanhe e interaja com a torcida da FURIA em tempo real!", // Descrição atualizada
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR" className="dark"> 
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
