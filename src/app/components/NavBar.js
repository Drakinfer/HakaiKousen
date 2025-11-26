'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/components/NavBar.css';
import { useSession, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from '../../../lib/lucide';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dexOpen, setDexOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { data: session, status } = useSession();
  const isEditor = session?.user.role === 'EDITOR' || false;
  const isAdmin = session?.user.role === 'ADMIN' || false;
  const isAuth = status ? status === 'authenticated' : false;

  const toggleMenu = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img src="/images/iconeHK.png" className="w-20" />
        </Link>
      </div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <div
          className="navbar-item z-20"
          onMouseEnter={() => setDexOpen(true)}
          onMouseLeave={() => setDexOpen(false)}
          onClick={() => setDexOpen(!dexOpen)}
        >
          <span>Dex</span>
          {dexOpen && (
            <div className="dropdown-menu">
              <Link href="/pokemons">Pokémons</Link>
              <Link href="/attacks">Attaques</Link>
              <Link href="/talents">Talents</Link>
            </div>
          )}
        </div>
        <Link href="/livres" className="navbar-item">
          Livres
        </Link>
        {(isAdmin || isEditor) && (
          <div
            className="navbar-item z-20"
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <span>Administration</span>
            {adminOpen && (
              <div className="dropdown-menu">
                <Link href="/admin/pokemons">Pokémons</Link>
                <Link href="/admin/attacks">Attaques</Link>
                <Link href="/admin/talents">Talents</Link>
                <Link href="/admin/types">Types</Link>
                <Link href="/admin/generations">Générations</Link>
                <Link href="/admin/livres">Livres</Link>

                {isAdmin && (
                  <>
                    <Link href="/admin/site">Site</Link>
                    <Link href="/admin/users">Utilisateurs</Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="navbar-auth flex w-50 items-center justify-around gap-4">
        {isAuth ? (
          <>
            <Link href="/profile" className="profile-icon">
              <User />
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut />
            </button>
          </>
        ) : (
          <>
            <Link href="/register">S'inscrire</Link>
            <Link href="/login">
              <LogIn />
            </Link>
          </>
        )}
      </div>
      <button className="burger-menu" onClick={toggleMenu}>
        ☰
      </button>
    </nav>
  );
};

export default NavBar;
