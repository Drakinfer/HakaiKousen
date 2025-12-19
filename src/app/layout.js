import { Inter } from 'next/font/google';
import './globals.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import NavBar from './components/NavBar.js';
import Providers from './components/Provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HakaiKousen, le JDR stratégique Pokémon',
  description:
    "Hakai Kousen, le jeu de rôle Pokémon sur table ou en ligne. Venez redécouvrir l'univers Pokémon sous de nouvelles formes, des batailles épiques, de l'élevage, des fous rires et larmes.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
