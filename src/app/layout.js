import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar.js"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HakaiKousen, le JDR stratégique Pokémon",
  description: "Hakai Kousen, le jeu de rôle Pokémon sur table ou en ligne. Venez redécouvrir l'univers Pokémon sous de nouvelles formes, des batailles épiques, de l'élevage, des fous rires et larmes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
