import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "File Sharing App",
  description: "Temporary File Sharing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#111827",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 20px",
              borderRadius: "16px",
              backdropFilter: "blur(16px)",
            },
          }}
        />

        {children}

      </body>
    </html>
  );
}