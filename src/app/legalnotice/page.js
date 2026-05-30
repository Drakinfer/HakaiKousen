'use client';

import Footer from '../components/Footer';

export default function LegalNoticePage() {
  return (
    <>
      <main className="items-center flex flex-col md:h-main-footer justify-center p-4 mb-50 md:mb-0">
        <h1 className="text-xl sm:text-2xl font-semibold mb-5">
          Mentions légales
        </h1>
        <div>
          <p className="mb-1">Dernière mise à jour : 02/01/2026</p>
          <p className="mb-1">
            Conformément aux dispositions des Articles 6-III et 19 de la Loi
            n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie
            numérique, dite L.C.E.N., il est porté à la connaissance des
            utilisateurs et visiteurs, ci-après l' "Utilisateur", du site
            hakaikousen.app , ci-après le "Site", les présentes mentions
            légales. La connexion et la navigation sur le Site par l’Utilisateur
            implique acceptation intégrale et sans réserve des présentes
            mentions légales. Ces dernières sont accessibles sur le Site à la
            rubrique « Mentions légales ».
          </p>
          <p className="mb-1">
            <span className="font-semibold">ARTICLE 1 - L'EDITEUR</span>
          </p>
          <p className="mb-1">
            L'édition du Site est assurée par Alexis "Drakinfer" CHAUVEAU
            ci-après l' "Editeur". Adresse e-mail : chauveau.alexis@hotmail.fr.
            Téléphone : 0677026844.
          </p>
          <p className="mb-1">
            <span className="font-semibold">ARTICLE 2 - L'HEBERGEUR</span>
          </p>
          <p className="mb-1">
            Ce site est hébergé par la société Vercel Inc., située 340 S Lemon
            Ave #4133 Walnut, CA 91789, et joignable au (559) 288-7060.
          </p>
          <p className="mb-1">
            <span className="font-semibold">ARTICLE 3 - ACCES AU SITE</span>
          </p>
          <p className="mb-1">
            Le Site est accessible en tout endroit, 7j/7, 24h/24 sauf cas de
            force majeure, interruption programmée ou non et pouvant découlant
            d’une nécessité de maintenance. En cas de modification, interruption
            ou suspension du Site, l'Editeur ne saurait être tenu responsable.
          </p>
          <p className="mb-1">
            <span className="font-semibold">
              ARTICLE 4 - COLLECTE DES DONNEES
            </span>
          </p>
          <p className="mb-1">
            Le Site assure à l'Utilisateur une collecte et un traitement
            d'informations personnelles dans le respect de la vie privée
            conformément à la loi n°78-17 du 6 janvier 1978 relative à
            l'informatique, aux fichiers et aux libertés. En vertu de la loi
            Informatique et Libertés, en date du 6 janvier 1978, l'Utilisateur
            dispose d'un droit d'accès, de rectification, de suppression et
            d'opposition de ses données personnelles. L'Utilisateur exerce ce
            droit : · via son espace personnel ; Toute utilisation,
            reproduction, diffusion, commercialisation, modification de toute ou
            partie du Site, sans autorisation de l’Editeur est prohibée et
            pourra entraînée des actions et poursuites judiciaires telles que
            notamment prévues par le Code de la propriété intellectuelle et le
            Code civil.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
