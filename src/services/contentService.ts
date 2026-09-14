import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from '../lib/firebase';
import { SiteContent } from '../types';
import { 
  BENEFITS_DATA as DEFAULT_BENEFITS, 
  TESTIMONIAL_DATA as DEFAULT_TESTIMONIAL, 
  BRAND_STORY as DEFAULT_BRAND_STORY 
} from '../data/products';

const CONTENT_DOC_ID = 'main';
const CONTENT_COLLECTION = 'site_content';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: '100% Natural • Cosechado en Colombia',
    headlineMain: 'Lo natural también puede',
    headlineAccent: 'transformar',
    headlineEnd: 'tu día.',
    description: 'Descubre alimentos, infusiones y tés artesanales elaborados con amor y pureza en Colombia. Creados para reconectarte con la tierra y cultivar tu energía y bienestar diario.',
    primaryCtaText: 'QUIERO MI PRODUCTO',
    secondaryCtaText: 'CONOCER LA LÍNEA'
  },
  benefits: DEFAULT_BENEFITS,
  featured: {
    eyebrow: 'PRODUCTO DESTACADO',
    title: 'Té Vital',
    quote: '“Una mezcla natural para comenzar el día con energía y bienestar.”',
    description: 'Una cuidada selección de té verde orgánico, menta silvestre, cáscaras de limón mandarino, jengibre andino y flores de caléndula cultivadas en las montañas de Colombia.',
    ctaText: 'CONOCER PRODUCTO'
  },
  about: {
    eyebrow: DEFAULT_BRAND_STORY.eyebrow,
    title: DEFAULT_BRAND_STORY.title,
    paragraph: DEFAULT_BRAND_STORY.paragraph,
    quote: '“Creemos en la sabiduría de la tierra y en el poder transformador de los hábitos simples y naturales.”'
  },
  testimonial: DEFAULT_TESTIMONIAL,
  finalCta: {
    eyebrow: 'Comienza hoy tu transformación natural',
    headline: 'Descubre el poder de lo artesanal y renueva tu',
    headlineAccent: 'bienestar diario.',
    description: 'Haz tu pedido hoy mismo y recibe en la puerta de tu casa los mejores tés, granolas, mieles e infusiones cosechadas con amor en el campo colombiano.',
    buttonText: 'QUIERO MI PRODUCTO'
  }
};

export const contentService = {
  // Subscribe to real-time site content
  subscribeContent(callback: (content: SiteContent) => void): () => void {
    if (!db) {
      callback(DEFAULT_SITE_CONTENT);
      return () => {};
    }
    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteContent;
          callback({
            ...DEFAULT_SITE_CONTENT,
            ...data
          });
        } else {
          callback(DEFAULT_SITE_CONTENT);
          // Seed default content
          contentService.saveContent(DEFAULT_SITE_CONTENT).catch((err) => {
            console.warn('Initial content seeding note:', err);
          });
        }
      }, (error) => {
        console.warn('Firestore content subscription error, using defaults:', error);
        callback(DEFAULT_SITE_CONTENT);
      });

      return unsubscribe;
    } catch (e) {
      console.warn('Content subscription fallback:', e);
      callback(DEFAULT_SITE_CONTENT);
      return () => {};
    }
  },

  // Save updated site content
  async saveContent(content: SiteContent): Promise<void> {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    await setDoc(docRef, {
      ...content,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  // Reset to default original content
  async resetToDefault(): Promise<SiteContent> {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    await setDoc(docRef, {
      ...DEFAULT_SITE_CONTENT,
      updatedAt: new Date().toISOString()
    });
    return DEFAULT_SITE_CONTENT;
  }
};
