
/**
 * Listado completo de razas de perro en España
 * Incluye razas autóctonas españolas y razas populares
 */

export const DOG_BREEDS = [
  // Razas Autóctonas Españolas
  'Galgo Español',
  'Podenco Ibicenco',
  'Mastín Español',
  'Alano Español',
  'Perro de Agua Español',
  'Can de Palleiro',
  'Gos d\'Atura Català',
  'Pachón Navarro',
  'Perdiguero de Burgos',
  'Ratonero Bodeguero Andaluz',
  'Podenco Canario',
  'Mastín del Pirineo',
  'Ca de Bou',
  'Maneto',
  'Villano de Las Encartaciones',
  'Perro Majorero',
  'Pastor Vasco',
  'Podenco Andaluz',
  
  // Razas Populares en España
  'Labrador Retriever',
  'Golden Retriever',
  'Pastor Alemán',
  'Border Collie',
  'Beagle',
  'Bulldog Francés',
  'Yorkshire Terrier',
  'Cocker Spaniel',
  'Boxer',
  'Rottweiler',
  'Husky Siberiano',
  'Chihuahua',
  'Pug',
  'Dálmata',
  'Jack Russell Terrier',
  'Setter Inglés',
  'Pointer Inglés',
  'Braco Alemán',
  'Weimaraner',
  'Doberman',
  'Gran Danés',
  'San Bernardo',
  'Terranova',
  'Akita Inu',
  'Shiba Inu',
  'Schnauzer',
  'Fox Terrier',
  'Bull Terrier',
  'Staffordshire',
  'American Bully',
  'Pitbull',
  'Dogo Argentino',
  'Cane Corso',
  'Presa Canario',
  'Pastor Belga',
  'Pastor Australiano',
  'Bernés de la Montaña',
  'Bobtail',
  'Collie',
  'Setter Irlandés',
  'Springer Spaniel',
  'Basset Hound',
  'Bloodhound',
  'Bichón Maltés',
  'Bichón Frisé',
  'Caniche',
  'Shih Tzu',
  'Lhasa Apso',
  'Pequinés',
  'Papillón',
  'Cavalier King Charles',
  'West Highland Terrier',
  'Scottish Terrier',
  'Airedale Terrier',
  'Welsh Corgi',
  'Spitz Alemán',
  'Samoyedo',
  'Malamute de Alaska',
  'Akbash',
  'Kangal',
  'Pastor de Anatolia',
  'Rhodesian Ridgeback',
  'Vizsla',
  'Brittany',
  'Gordon Setter',
  'Irish Water Spaniel',
  'Nova Scotia Duck Tolling Retriever',
  'Flat-Coated Retriever',
  'Chesapeake Bay Retriever',
  'Lagotto Romagnolo',
  'Spinone Italiano',
  'Bracco Italiano',
  'Segugio Italiano',
  'Volpino Italiano',
  
  // Opciones Generales
  'Mestizo',
  'Cruza',
  'Desconocida',
  'Otra'
] as const;

export type DogBreed = typeof DOG_BREEDS[number];

/**
 * Razas autóctonas españolas
 */
export const SPANISH_BREEDS = [
  'Galgo Español',
  'Podenco Ibicenco', 
  'Mastín Español',
  'Alano Español',
  'Perro de Agua Español',
  'Can de Palleiro',
  'Gos d\'Atura Català',
  'Pachón Navarro',
  'Perdiguero de Burgos',
  'Ratonero Bodeguero Andaluz',
  'Podenco Canario',
  'Mastín del Pirineo',
  'Ca de Bou',
  'Maneto',
  'Villano de Las Encartaciones',
  'Perro Majorero',
  'Pastor Vasco',
  'Podenco Andaluz'
] as const;

/**
 * Función para verificar si una raza es autóctona española
 */
export const isSpanishBreed = (breed: string): boolean => {
  return SPANISH_BREEDS.includes(breed as any);
};

/**
 * Función para obtener sugerencias de razas basadas en texto
 */
export const getBreedSuggestions = (searchTerm: string): string[] => {
  if (!searchTerm) return DOG_BREEDS.slice(0, 10);
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return DOG_BREEDS.filter(breed => 
    breed.toLowerCase().includes(lowercaseSearch)
  ).slice(0, 10);
};
