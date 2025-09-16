'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/components/NavBar.css';

const userRole = 'super_admin'; // Remplacez par votre système d'authentification pour détecter le rôle utilisateur

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dexOpen, setDexOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">Site Logo</Link>
      </div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <div
          className="navbar-item"
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
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <div
            className="navbar-item"
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
                <Link href="/admin/site">Site</Link>
                {userRole === 'super_admin' && (
                  <Link href="/admin/utilisateurs">Utilisateurs</Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="navbar-auth">
        <Link href="/signup">S'inscrire</Link>
        <Link href="/login">Se connecter</Link>
        <Link href="/profile" className="profile-icon">
          👤
        </Link>
      </div>
      <button className="burger-menu" onClick={toggleMenu}>
        ☰
      </button>
    </nav>
  );
};

export default NavBar;
