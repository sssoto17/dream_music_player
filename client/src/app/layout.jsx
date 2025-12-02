import { Manrope } from "next/font/google";
import "@/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dream Music Player",
  description: "Your dreamiest music library.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable}`} suppressHydrationWarning>
        {/* <header className="fixed top-0 z-50">
          <nav>
            <ul>
              <li>Home</li>
            </ul>
          </nav>
        </header> */}
        {children}
      </body>
    </html>
  );
}
