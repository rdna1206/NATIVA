import { Product, Benefit, TestimonialItem } from '../types';

// Real photographed botanical assets matching the user's photoshoot
import teVitalImg from '../assets/images/te_vital_1789388965028.jpg';
import granolaNativaImg from '../assets/images/granola_nativa_1789388979898.jpg';
import mielMontanaImg from '../assets/images/miel_montana_1789388995068.jpg';
import infusionRelaxImg from '../assets/images/infusion_relax_1789389007304.jpg';
import sobreNativaImg from '../assets/images/sobre_nativa_1789389040731.jpg';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'te-vital',
    name: 'Té Vital',
    category: 'Infusiones & Tés',
    tagline: 'Mezcla natural de hierbas aromáticas',
    description: 'Una delicada selección de hierbas orgánicas y flores silvestres diseñadas para revitalizar tu día de forma natural y equilibrada.',
    longDescription: 'Una mezcla natural para comenzar el día con energía y bienestar. Elaborado con una cuidada selección de té verde orgánico, menta silvestre, cáscaras de limón mandarino, jengibre andino y flores de caléndula cultivadas en las montañas de Colombia.',
    price: 28000,
    weight: '80g (rinde 35 tazas)',
    rating: 4.9,
    reviewsCount: 142,
    image: teVitalImg,
    ingredients: ['Té verde orgánico', 'Menta silvestre', 'Cáscara de limón mandarino', 'Jengibre andino', 'Flores de caléndula'],
    benefits: [
      'Aumenta la energía y vitalidad de manera natural y sostenida',
      'Rico en antioxidantes y bioflavonoides protectores',
      'Favorece la digestión ligera en las mañanas',
      '100% libre de saborizantes artificiales'
    ],
    origin: 'Cundinamarca, Colombia (Cultivo agroecológico)',
    usageInstructions: 'Infusionar 1 cucharadita en agua caliente a 85°C durante 4 a 5 minutos.',
    isFeatured: true
  },
  {
    id: 'granola-nativa',
    name: 'Granola Nativa',
    category: 'Alimentos Saludables',
    tagline: 'Granola artesanal con frutos secos',
    description: 'Hojuelas de avena integral horneadas lentamente con miel de abeja pura, frutos secos seleccionados y un toque de canela.',
    longDescription: 'Granola artesanal crujiente horneada en pequeños lotes con avena integral, almendras tostadas, nueces del nogal, semillas de chía, semillas de calabaza y uvas pasas, ligeramente endulzada con miel de montaña.',
    price: 32000,
    weight: '350g empaque resellable',
    rating: 4.8,
    reviewsCount: 98,
    image: granolaNativaImg,
    ingredients: ['Avena integral en hojuelas', 'Almendras seleccionadas', 'Nueces', 'Semillas de chía y calabaza', 'Miel pura de abejas', 'Canela'],
    benefits: [
      'Excelente fuente de fibra prebiótica natural',
      'Aporta energía limpia y saciedad prolongada',
      'Sin aceites hidrogenados ni azúcares refinados'
    ],
    origin: 'Boyacá y Valle del Cauca, Colombia',
    usageInstructions: 'Disfrutar con yogur, frutas frescas o bebidas vegetales.',
    isFeatured: false
  },
  {
    id: 'miel-de-montana',
    name: 'Miel de Montaña',
    category: 'Mieles Puras',
    tagline: 'Miel natural de producción local',
    description: 'Cosechada de forma ética y sostenible en las zonas altas de la cordillera. 100% natural, cruda y con notas florales únicas.',
    longDescription: 'Miel 100% pura y cruda cosechada artesanalmente en apiarios rodeados de bosque andino nativo a más de 2.200 msnm. Mantiene intactas todas sus enzimas activas y polen.',
    price: 36000,
    weight: '300g frasco de vidrio',
    rating: 5.0,
    reviewsCount: 167,
    image: mielMontanaImg,
    ingredients: ['100% Miel pura de abejas de bosque andino (multiflora)'],
    benefits: [
      'Fortalece las defensas naturales del cuerpo',
      'Propiedades antibacterianas y calmantes',
      'Endulzante natural sin aditivos ni glucosa añadida'
    ],
    origin: 'Reserva Andina, Boyacá, Colombia',
    usageInstructions: 'Tomar 1 cucharadita directa o para endulzar infusiones y recetas.',
    isFeatured: false
  },
  {
    id: 'infusion-relax',
    name: 'Infusión Relax',
    category: 'Infusiones & Tés',
    tagline: 'Mezcla de plantas aromáticas para relajación',
    description: 'La mezcla perfecta de lavanda, pasiflora y toronjil. Diseñada para calmar la mente y propiciar un descanso profundo y reparador.',
    longDescription: 'Selección calmante de plantas medicinales tradicionales: manzanilla dulce, hojas de toronjil, pasiflora silvestre, flores de lavanda y cedrón colombiano para serenar el cuerpo y conciliar un sueño reparador.',
    price: 28000,
    weight: '80g (rinde 35 tazas)',
    rating: 4.9,
    reviewsCount: 115,
    image: infusionRelaxImg,
    ingredients: ['Flores de manzanilla dulce', 'Hojas de toronjil (melisa)', 'Pasiflora silvestre', 'Flores de lavanda', 'Cedrón'],
    benefits: [
      'Alivia la tensión muscular y el estrés cotidiano',
      'Propicia un descanso nocturno profundo y natural',
      'Sin cafeína ni aditivos químicos'
    ],
    origin: 'Antioquia y Eje Cafetero, Colombia',
    usageInstructions: 'Reposar 1 cucharadita en agua a 95°C durante 6 a 8 minutos antes de dormir.',
    isFeatured: false
  }
];

export const BENEFITS_DATA: Benefit[] = [
  {
    id: 'natural',
    iconName: 'leaf',
    title: 'Natural',
    description: 'Ingredientes puros de origen botánico, libres de químicos y aditivos artificiales.'
  },
  {
    id: 'artesanal',
    iconName: 'hand',
    title: 'Artesanal',
    description: 'Elaborados a mano en pequeños lotes respetando técnicas y recetas tradicionales.'
  },
  {
    id: 'saludable',
    iconName: 'heart',
    title: 'Saludable',
    description: 'Fórmulas equilibradas que nutren el cuerpo y transforman tu bienestar cada día.'
  },
  {
    id: 'local',
    iconName: 'map',
    title: 'Local',
    description: 'Cosechado de forma ética por familias campesinas y apicultores colombianos.'
  }
];

export const TESTIMONIAL_DATA: TestimonialItem = {
  id: 'testimonio-principal',
  quote: '“Incorporar los productos de NATIVA en mi rutina diaria transformó por completo mi bienestar. La pureza y el aroma de las infusiones se sienten desde el primer momento. Saber que son elaborados de forma artesanal y local en Colombia hace toda la diferencia.”',
  author: 'Cliente NATIVA',
  role: 'Compradora verificada',
  location: 'Colombia',
  rating: 5,
  productUsed: 'Línea de Bienestar NATIVA',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop'
};

export const BRAND_STORY = {
  eyebrow: 'SOBRE NATIVA',
  title: 'Nuestra esencia',
  paragraph: 'Nacimos del respeto profundo por la tierra y el deseo de rescatar los procesos tradicionales. Cada uno de nuestros productos es elaborado a mano en pequeños lotes, garantizando la pureza, el sabor auténtico y el bienestar de tu familia de manera sostenible.',
  image: sobreNativaImg
};
