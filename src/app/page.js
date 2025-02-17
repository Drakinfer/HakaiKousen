'use client';
import Footer from './components/Footer';
import { useState } from 'react';

export default function Home() {
  const [announcement, setAnnouncement] = useState([
    '🔥 Nouvelle mise à jour : Découvrez nos dernières fonctionnalités !',
    "Le site est actuellement en cours de remplissage. Si l'information que vous cherchez n'est pas encore disponible, nous vous prions de patienter ou alors vous pouvez vous rendre sur le discord Hakai Kousen pour obtenir plus d'informations.",
  ]);

  const [descriptions, setDescriptions] = useState([
    {
      title: "L'Univers Pokémon",
      text: "Dans l'univers des Pokémon, les animaux du monde réel n'existent pas (ou très peu). Le monde est peuplé de Pokémon, des créatures qui vivent en harmonie avec les humains et qui possèdent des aptitudes hors du commun comme : cracher du feu comme Dracaufeu, ou encore générer de grandes quantités d'électricité, comme Pikachu. Chaque espèce de Pokémon possède un nom, qui peut à la fois être utilisé pour parler d'un Pokémon individuel ou de l'ensemble des Pokémon de la même espèce. À ce jour il existe un peu moins de 950 Pokémons différent connus à ce joue. Ce qui vous laisse un large choix de compagnons. Certains Pokémon dits `Légendaires` sont les seuls représentants de leur sorte, ils sont des entités incarnant une puissance naturelle et gérant un aspect du monde bien précis. En général, les Pokémon ne peuvent prononcer que leur nom, mais il existe quelques cas rares où des Pokémon ont appris un langage humain. Les humains utilisent les aptitudes des Pokémon dans la vie de tous les jours : comme les Pokémon plante s'occupant du jardin, mais aussi dans les activités professionnelles : comme les Caninos des Agents des forces de l'ordre ou encore les artisans du bâtiment s'aidant de Machoc ou de Charpenti en utilisant leur grande force physique. La plupart des humains protègent leurs amis Pokémon en les capturant dans des Poké Balls, des balles compactes où un Pokémon peut être contenu. Le Pokémon ainsi capturé est en sécurité dans sa Poké Ball. Si celui-ci était blessé, son état est stabilisé. Le confort des Balls dépend du type de Ball utilisé lors de la capture. Une Poké Ball possède un confort standard alors qu’une Luxe Ball possède le confort le plus élevé à ce jour. Certains humains aspirent à devenir des Dresseurs Pokémon et voyagent à travers le monde dans le but d'attraper le plus grand nombre de Pokémon comme Sacha dans l’anime. Le lien entre un Dresseur et ses Pokémon est quelque chose de très important. Afin d’accompagner ces dresseurs, le Professeur Pokémon de la région les guident en leur offrant un Pokémon (souvent leur premier) et en leur expliquant les bases qu’ils devront mettre en pratique au cours d'un voyage initiatique.",
    },
    {
      title: null,
      text: "Suite à cela, certains ressentiront le besoin de se dépasser et essayeront de devenir Maître Pokémon, un titre donné au dresseur ayant battu le Maître de la Ligue. Certains Dresseurs enregistrent les informations des Pokémon qu'ils ont capturés ou observés dans un Pokédex, un appareil électronique qui répertorie et affiche les informations sur les différents Pokémon, donné par le Professeur de sa région. Il n’y a apparemment pas d’âge pour commencer son apprentissage de Dresseur et recevoir une licence de la Ligue Pokémon. L'apprentissage consiste à partir capturer des Pokémon dans leurs habitats naturels, puis à les entraîner au combat. Les matchs Pokémon sont des combats entre les Pokémon de deux Dresseurs, et se terminent quand tous les Pokémon de l'un d'entre eux sont KO. Les Pokémon peuvent être soignés au Centre Pokémon, un bâtiment ressemblant fortement à un hôpital où les infirmières guérissent les Pokémon blessés. La majorité du temps les blessures sont soignées magiquement en quelques secondes seulement et le Pokémon ne ressent plus aucune douleur. Cependant, dans certains cas (ex:fracture ouverte grave, blessure très profonde) il faudra plusieurs jours passé au centre Pokémon pour guérir totalement. Pour participer à des compétitions, les Dresseurs peuvent se déplacer jusqu'aux différentes Arènes Pokémon où un badge leur est offert s'ils sortent victorieux d'un match contre le champion d'arène. Après avoir gagné tous les badges de la région, un Dresseur peut partir au siège de la Ligue Pokémon pour affronter quatre Dresseurs d'élite, souvent appelés le `Conseil des 4`. Ce n'est qu'après avoir battu ces quatre élites que le Dresseur peut affronter le Maître de la Ligue. Mais tous les Dresseurs n'aspirent pas à la voie d'affronter le Maître de la Ligue de leur région, il existe bien des vocations et des buts différents propre à chaque personnes. Un pompier peut partir à la recherche de coéquipiers Pokémon afin de lutter plus efficacement contre les flammes. Un cuisinier peut vouloir arpenter les différentes régions afin de récupérer les meilleurs recettes. Un karatéka peut vouloir maîtriser d’autres techniques de combats et ira de région en région affronter les maîtres des dojos de combat afin de parfaire son art et qui sait, se faire de nouveaux amis Pokemon.",
    },
    {
      title: 'Hakai Kousen, le Jeu de rôle Pokémon',
      text: "Maintenant qu'on vous a parlé de Jeu de rôle et de Pokémon, bah on va parlez des 2 en même temps. Imaginez-vous, volant fièrement sur un Dracaufeu, ou barbotant dans l'eau avec un Nenupiot. La classe non? Bah c'est possible avec Hakai Kousen et les documents disponibles dans la rubrique Docs. Vous y trouverez une base de règles, ainsi que des conseils et scnéarios déjà prêt à jouer. Cependant n'oubliez pas une chose, le jeu de rôle vient de votre imagination, donc si vous trouvez qu'une des règles que l'on vous donne ne vous convient pas, enlevez-là (C'est pas comme-ci on allait inspecter toutes les tables pour voir qui respectent les règles qu'on a mis si longtemps à élaborer). L'important c'est de prendre du plaisir, donc amusez-vous!!!!",
    },
    {
      title: 'Le jeu de rôle, kesako?',
      text: "Le jeu de rôle est un jeu de société dans lequel les participants conçoivent ensemble une fiction par l’interprétation de rôles et par la narration. Les joueurs se retrouvent principalement autour d'une table, avec pour accessoires des dés et feuilles de papier (il est également possible de jouer sur un serveur vocal tel que discord ou roll20). Une personne interprète le rôle d'un personnage imaginaire dans un environnement fictif (ici un Dresseur dans l’univers de Pokémon). Le participant agit à travers ce rôle par des actions (dialogues, descriptions, jeu) et par des prises de décision sur le développement du personnage, de son histoire et de l’histoire globale.",
    },
  ]);

  return (
    <>
      <main className="main-content">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 mb-10">
          {announcement && (
            <div className="w-1/2 bg-red-500 text-white text-center p-3 shadow-md mt-3 mb-6">
              {announcement.map((announce) => (
                <p className="text-lg font-semibold">{announce}</p>
              ))}
            </div>
          )}

          {descriptions && (
            <div className="w-full p-3">
              {descriptions.map((desc) => (
                <div>
                  {desc.title && (
                    <p className="text-m font-semibold">{desc.title}</p>
                  )}
                  <p className="text-m">{desc.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
