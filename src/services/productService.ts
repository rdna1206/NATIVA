import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  onSnapshot 
} from '../lib/firebase';
import { Product } from '../types';
import { PRODUCTS_DATA as CANONICAL_PRODUCTS } from '../data/products';

const PRICES_COLLECTION = 'product_prices';
const PRODUCTS_COLLECTION = 'products';
const LOCAL_STORAGE_PRICES_KEY = 'nativa_product_prices';

// Helper to get local stored prices
const getStoredLocalPrices = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Helper to save local stored prices
const saveStoredLocalPrices = (pricesMap: Record<string, number>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(pricesMap));
  } catch {}
};

/**
 * Builds the canonical list of the 4 NATIVA products,
 * strictly preserving their names, photoshoot photographs, descriptions, and order,
 * while applying any updated prices from Firestore or local cache.
 */
const buildMergedProducts = (priceMap: Record<string, number>): Product[] => {
  const localPrices = getStoredLocalPrices();

  return CANONICAL_PRODUCTS.map((canonical) => {
    // 1. Check if Firestore provided a valid price
    const remotePrice = priceMap[canonical.id];
    // 2. Check if localStorage has an updated price
    const localPrice = localPrices[canonical.id];

    let effectivePrice = canonical.price;
    if (typeof remotePrice === 'number' && Number.isFinite(remotePrice) && remotePrice > 0) {
      effectivePrice = remotePrice;
    } else if (typeof localPrice === 'number' && Number.isFinite(localPrice) && localPrice > 0) {
      effectivePrice = localPrice;
    }

    return {
      ...canonical, // Always keep original name, photos, descriptions, weight, etc.
      price: effectivePrice,
      isActive: true
    };
  });
};

export const productService = {
  // Ensure the 4 canonical products exist in Firestore with their initial prices
  async seedInitialProducts(): Promise<void> {
    if (!db) return;
    try {
      for (const item of CANONICAL_PRODUCTS) {
        // Save price in product_prices collection
        await setDoc(doc(db, PRICES_COLLECTION, item.id), {
          productId: item.id,
          name: item.name,
          price: item.price,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Also save in products collection for compatibility
        await setDoc(doc(db, PRODUCTS_COLLECTION, item.id), {
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          tagline: item.tagline,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not seed prices into Firestore:', err);
    }
  },

  /**
   * Subscribes to real-time prices.
   * ALWAYS returns the 4 original products in exact canonical order:
   * 1. Té Vital
   * 2. Granola Nativa
   * 3. Miel de Montaña
   * 4. Infusión Relax
   */
  subscribeProducts(callback: (products: Product[]) => void): () => void {
    // Initial emission guarantees immediate render with all 4 products
    callback(buildMergedProducts({}));

    if (!db) {
      return () => {};
    }

    try {
      // Listen to product_prices collection
      const pricesColRef = collection(db, PRICES_COLLECTION);
      const unsubscribe = onSnapshot(pricesColRef, (snapshot) => {
        const pricesMap: Record<string, number> = {};

        if (!snapshot.empty) {
          snapshot.forEach((d) => {
            const data = d.data();
            if (data && typeof data.price === 'number' && data.price > 0) {
              pricesMap[d.id] = data.price;
            }
          });
        } else {
          // If empty, automatically seed initial prices in background
          productService.seedInitialProducts();
        }

        // Also listen or merge if products collection has price data
        const merged = buildMergedProducts(pricesMap);
        callback(merged);
      }, (error) => {
        console.warn('Firestore prices subscription warning, using local canonical products:', error);
        callback(buildMergedProducts({}));
      });

      return unsubscribe;
    } catch (err) {
      console.warn('Subscription error, using canonical products:', err);
      callback(buildMergedProducts({}));
      return () => {};
    }
  },

  // Get current 4 products once
  async getProducts(): Promise<Product[]> {
    if (!db) return buildMergedProducts({});
    try {
      const colRef = collection(db, PRICES_COLLECTION);
      const snapshot = await getDocs(colRef);
      const pricesMap: Record<string, number> = {};
      snapshot.forEach((d) => {
        const data = d.data();
        if (data && typeof data.price === 'number' && data.price > 0) {
          pricesMap[d.id] = data.price;
        }
      });
      return buildMergedProducts(pricesMap);
    } catch (error) {
      console.warn('Error fetching prices from Firestore:', error);
      return buildMergedProducts({});
    }
  },

  /**
   * ONLY updates the price of one of the 4 canonical products.
   * Validates that the price is a positive finite number.
   * Modifying other fields, creating new products, or deleting products is strictly disabled.
   */
  async updateProductPrice(productId: string, newPrice: number): Promise<void> {
    const validProduct = CANONICAL_PRODUCTS.find(p => p.id === productId);
    if (!validProduct) {
      throw new Error(`El producto con ID "${productId}" no es uno de los 4 productos de NATIVA.`);
    }

    const numericPrice = Number(newPrice);
    if (isNaN(numericPrice) || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      throw new Error('Por favor ingresa un precio numérico válido mayor a 0.');
    }

    const roundedPrice = Math.round(numericPrice);
    const now = new Date().toISOString();

    // 1. Update local cache immediately for instant UI feedback
    const localPrices = getStoredLocalPrices();
    localPrices[productId] = roundedPrice;
    saveStoredLocalPrices(localPrices);

    // 2. Persist to Firestore if available
    if (db) {
      try {
        // Save in product_prices collection
        await setDoc(doc(db, PRICES_COLLECTION, productId), {
          productId,
          name: validProduct.name,
          price: roundedPrice,
          updatedAt: now
        }, { merge: true });

        // Sync to products collection
        await setDoc(doc(db, PRODUCTS_COLLECTION, productId), {
          id: productId,
          name: validProduct.name,
          price: roundedPrice,
          updatedAt: now
        }, { merge: true });
      } catch (err) {
        console.error('Error saving price to Firestore:', err);
        throw new Error('No se pudo guardar el precio en Firebase. Por favor intenta de nuevo.');
      }
    }
  }
};
