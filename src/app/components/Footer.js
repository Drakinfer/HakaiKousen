'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import '../styles/components/Footer.css';

const Footer = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFooterOpen && !event.target.closest('.footer, .footer-toggle')) {
        setIsFooterOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isFooterOpen]);

  const toggleFooter = () => {
    setIsFooterOpen(!isFooterOpen);
  };

  return (
    <>
      <div className="footer-toggle" onClick={toggleFooter}>
        <FontAwesomeIcon
          icon={isFooterOpen ? faChevronDown : faChevronUp}
          size="lg"
        />
      </div>
      <footer className={`footer ${isFooterOpen ? 'open' : ''}`}>
        <div className="footer-section footer-left">
          <p>
            Hakai Kousen est une encyclopédie Pokemon communautaire adaptant
            certaines informations pour le jeu de rôle.
          </p>
          <p>
            Les personnages, le thème "Pokémon ®" et ses marques dérivées sont
            propriétés de Nintendo, The Pokémon Company, Game Freak, Creatures.
          </p>
          <p>Les images des Pokémons appartiennent au site Poképédia.</p>
          <p>
            Le présent site web n'est pas le site francophone officiel de
            Pokémon. Il n'a pas de but lucratif. Il s'agit d'un site
            communautaire créé par et pour des fans de Pokémon.
          </p>
          <p>
            Ce site est disponible sous licence{' '}
            <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/fr/">
              Paternité - Pas d'Utilisation Commerciale - Partage des Conditions
              Initiales à l'Identique 3.0
            </a>{' '}
            sauf mention contraire.
          </p>
        </div>

        <div className="footer-links-container">
          <div className="footer-section footer-links">
            <Link href="/pokemons">Pokémons</Link>
            <Link href="/attaques">Attaques</Link>
            <Link href="/talents">Talents</Link>
            <Link href="/livres">Livres</Link>
          </div>

          <div className="footer-section footer-links">
            <Link href="/">Accueil</Link>
            <Link href="/discord">
              <FontAwesomeIcon icon={faDiscord} size="lg" />
            </Link>
            <Link href="/signup">S'inscrire</Link>
            <Link href="/login">Se connecter</Link>
          </div>

          <div className="footer-section footer-right">
            <Link href="/mentions-legales">Mentions Légales</Link>
            <Link href="/equipe">L'Équipe Hakai Kousen</Link>
            <div className="license-logo">
              <img
                src="/images/licence_CC.png"
                alt="Licence Creative Commons"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
