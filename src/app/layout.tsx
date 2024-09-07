import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="max-w-screen-md min-w-[320px] mx-auto">
        <main className="flex flex-col gap-4">
          {children}
        </main>
      </body>
    </html>
  );
}
