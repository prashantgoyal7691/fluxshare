import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}