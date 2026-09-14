import { storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import heroImg from '../assets/images/hero_nativa_1789389026948.jpg';
import teVitalImg from '../assets/images/te_vital_1789388965028.jpg';
import granolaNativaImg from '../assets/images/granola_nativa_1789388979898.jpg';
import mielMontanaImg from '../assets/images/miel_montana_1789388995068.jpg';
import infusionRelaxImg from '../assets/images/infusion_relax_1789389007304.jpg';
import sobreNativaImg from '../assets/images/sobre_nativa_1789389040731.jpg';

export interface GalleryImage {
  id: string;
  name: string;
  category: string;
  url: string;
  isDefault?: boolean;
}

export const OFFICIAL_GALLERY: GalleryImage[] = [
  {
    id: 'img-hero',
    name: 'Bodegón Botánico & Bienestar (Hero)',
    category: 'Principal / Hero',
    url: heroImg,
    isDefault: true
  },
  {
    id: 'img-te-vital',
    name: 'Té Vital Artesanal en Taza',
    category: 'Productos / Tés',
    url: teVitalImg,
    isDefault: true
  },
  {
    id: 'img-granola',
    name: 'Granola Nativa con Frutos Secos',
    category: 'Productos / Alimentos',
    url: granolaNativaImg,
    isDefault: true
  },
  {
    id: 'img-miel',
    name: 'Miel de Montaña & Panal',
    category: 'Productos / Mieles',
    url: mielMontanaImg,
    isDefault: true
  },
  {
    id: 'img-relax',
    name: 'Infusión Relax con Lavanda',
    category: 'Productos / Infusiones',
    url: infusionRelaxImg,
    isDefault: true
  },
  {
    id: 'img-sobre-nativa',
    name: 'Taller Botánico & Mortero (Sobre NATIVA)',
    category: 'Marca / Taller',
    url: sobreNativaImg,
    isDefault: true
  }
];

export const storageService = {
  // Convert uploaded file to base64 Data URL or upload to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      // Try uploading to Firebase Storage first
      const fileExt = file.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `nativa_images/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (storageErr) {
      console.warn('Firebase Storage upload direct error, using resilient client Data URL:', storageErr);
      
      // Resilient fallback: convert to base64 Data URL so user can preview and save seamlessly
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert image to Data URL'));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }
  },

  // Get gallery list
  getAvailableImages(): GalleryImage[] {
    // Read any custom saved images from localStorage
    try {
      const saved = localStorage.getItem('nativa_custom_images');
      if (saved) {
        const custom: GalleryImage[] = JSON.parse(saved);
        return [...custom, ...OFFICIAL_GALLERY];
      }
    } catch (e) {
      console.warn('Error reading custom gallery images:', e);
    }
    return OFFICIAL_GALLERY;
  },

  // Save new image to custom gallery
  saveToGallery(image: GalleryImage): void {
    try {
      const current = storageService.getAvailableImages().filter(i => !i.isDefault);
      const updated = [image, ...current];
      localStorage.setItem('nativa_custom_images', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving to custom gallery:', e);
    }
  }
};
