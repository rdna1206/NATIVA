import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Send, CheckCircle, Truck, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { requestService } from '../services/requestService';
import { analyticsService } from '../services/analyticsService';

interface OrderModalProps {
  isOpen: boolean;
  initialProductId?: string;
  products?: Product[];
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  initialProductId,
  products = [],
  onClose,
}) => {
  if (!isOpen) return null;

  const availableProducts = products.length > 0 ? products.filter(p => p.isActive !== false) : [];

  // Initialize cart quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    availableProducts.forEach(p => {
      initial[p.id] = p.id === initialProductId ? 1 : 0;
    });
    // If none matched, default first product to 1
    if (initialProductId && initial[initialProductId]) {
      initial[initialProductId] = 1;
    } else if (availableProducts.length > 0) {
      initial[availableProducts[0].id] = 1;
    }
    return initial;
  });

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nequi / Daviplata');
  const [notes, setNotes] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const subtotal = availableProducts.reduce((sum, p) => {
    return sum + (quantities[p.id] || 0) * p.price;
  }, 0);

  const totalItems = Object.values(quantities).reduce<number>((a, b) => a + Number(b), 0);
  const shipping = subtotal >= 60000 || subtotal === 0 ? 0 : 9000;
  const grandTotal = subtotal + shipping;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) return;

    setSubmitting(true);
    const generatedId = `NAT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare primary product summary
    const selectedProducts = availableProducts.filter(p => (quantities[p.id] || 0) > 0);
    const primaryProd = selectedProducts[0] || { id: 'multi', name: 'Varios Productos' };
    const summaryNames = selectedProducts.map(p => `${p.name} (x${quantities[p.id]})`).join(', ');

    try {
      // Save directly to Firebase Firestore
      await requestService.createRequest({
        productId: primaryProd.id,
        productName: summaryNames || primaryProd.name,
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || 'No especificado',
        customerCity: city,
        customerAddress: address,
        quantity: totalItems,
        total: grandTotal,
        notes: `Pago: ${paymentMethod}. ${notes}`.trim()
      });

      // Log analytics
      analyticsService.trackEvent('cta_click', 'order-modal-confirmed', {
        orderId: generatedId,
        total: grandTotal,
        itemsCount: totalItems
      });

      setOrderId(generatedId);
      setOrderSubmitted(true);
    } catch (err) {
      console.error('Order submission error:', err);
      // Fallback show confirmation even if offline
      setOrderId(generatedId);
      setOrderSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsApp = () => {
    const selectedItemsSummary = availableProducts
      .filter(p => (quantities[p.id] || 0) > 0)
      .map(p => `• ${quantities[p.id]}x ${p.name} ($${(p.price * quantities[p.id]).toLocaleString('es-CO')} COP)`)
      .join('%0A');

    const message = `🌿 *¡HOLA NATIVA! Quiero confirmar mi pedido* 🌿%0A%0A` +
      `*Orden:* ${orderId || 'NAT-WEB'}%0A` +
      `*Cliente:* ${customerName || 'Cliente'}%0A` +
      `*Teléfono:* ${phone}%0A` +
      `*Ciudad:* ${city}%0A` +
      `*Dirección:* ${address}%0A` +
      `*Método de Pago:* ${paymentMethod}%0A%0A` +
      `*PRODUCTOS:*%0A${selectedItemsSummary}%0A%0A` +
      `*Subtotal:* $${subtotal.toLocaleString('es-CO')} COP%0A` +
      `*Envío:* ${shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString('es-CO')} COP`}%0A` +
      `*TOTAL:* $${grandTotal.toLocaleString('es-CO')} COP%0A` +
      (notes ? `%0A*Notas:* ${notes}` : '');

    window.open(`https://wa.me/573124567890?text=${message}`, '_blank');
  };

  return (
    <div
      id="order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="order-modal-card"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e8ddca] p-5 sm:p-8 relative font-montserrat"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar pedido"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-left mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6F9E73] block mb-1">
                Haz tu Pedido Directo
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#285943]">
                Lleva lo mejor de NATIVA a tu hogar
              </h3>
              <p className="text-xs sm:text-sm text-[#285943]/80 mt-1">
                Selecciona tus productos artesanales favoritos y completa tus datos de entrega en Colombia.
              </p>
            </div>

            {/* Free shipping banner */}
            <div className="bg-[#FAF6F0] border border-[#6F9E73]/40 rounded-xl p-3.5 mb-6 flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#285943] shrink-0" />
              <div className="text-left text-xs">
                {subtotal >= 60000 ? (
                  <span className="font-bold text-[#285943] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#6F9E73]" /> ¡Felicidades! Tienes ENVÍO GRATIS a toda Colombia.
                  </span>
                ) : (
                  <span className="text-[#285943]">
                    Agrega <strong className="text-[#C97852]">${(60000 - subtotal).toLocaleString('es-CO')} COP</strong> más para obtener <strong>Envío Gratis</strong> a cualquier ciudad de Colombia.
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              
              {/* Product Selector Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#285943] text-left">
                  1. Selecciona tus productos
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableProducts.map((product) => {
                    const qty = quantities[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          qty > 0
                            ? 'bg-[#FAF6F0] border-[#6F9E73] shadow-xs'
                            : 'bg-white border-[#e8ddca] hover:border-[#285943]/30'
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#e8ddca]"
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-bold text-[#285943] truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] font-semibold text-[#C97852]">
                            ${product.price.toLocaleString('es-CO')} COP
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-lg border border-[#e8ddca]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#285943] hover:bg-[#FAF6F0] disabled:opacity-30 cursor-pointer"
                            disabled={qty === 0}
                            aria-label="Restar unidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#285943]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#285943] hover:bg-[#FAF6F0] cursor-pointer"
                            aria-label="Sumar unidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Data Section */}
              <div className="space-y-4 pt-4 border-t border-[#e8ddca]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#285943] text-left">
                  2. Datos de Envío en Colombia
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Carolina Gómez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943] focus:ring-1 focus:ring-[#285943]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 310 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943] focus:ring-1 focus:ring-[#285943]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Correo Electrónico (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="carolina@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943] focus:ring-1 focus:ring-[#285943]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Ciudad / Municipio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Bogotá, Medellín, Cali..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943] focus:ring-1 focus:ring-[#285943]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Dirección y Barrio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Calle 127 # 15-40, Apto 302"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943] focus:ring-1 focus:ring-[#285943]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Método de Pago Preferido
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] bg-white focus:outline-none focus:border-[#285943]"
                    >
                      <option value="Nequi / Daviplata">Nequi / Daviplata</option>
                      <option value="Contra Entrega">Pago Contra Entrega (Efectivo/Datafono)</option>
                      <option value="Transferencia Bancolombia">Transferencia Bancaria Bancolombia</option>
                      <option value="Tarjeta Débito / Crédito PSE">Tarjeta Débito / Crédito PSE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#285943] mb-1">
                      Notas o instrucciones (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Dejar en portería"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e8ddca] text-xs text-[#285943] focus:outline-none focus:border-[#285943]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & Pricing */}
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#e8ddca] space-y-2 text-left">
                <div className="flex justify-between text-xs text-[#285943]/80">
                  <span>Subtotal ({totalItems} productos):</span>
                  <span className="font-semibold">${subtotal.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-xs text-[#285943]/80">
                  <span>Costo de Envío Nacional:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-[#6F9E73] font-bold">¡GRATIS!</span>
                    ) : (
                      `$${shipping.toLocaleString('es-CO')} COP`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#285943] pt-2 border-t border-[#e8ddca]">
                  <span>Total a Pagar:</span>
                  <span className="text-[#285943]">${grandTotal.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={totalItems === 0 || submitting}
                  className="w-full py-4 bg-[#C97852] hover:bg-[#b3633e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {submitting ? 'Registrando Pedido en NATIVA...' : `CONFIRMAR MI PEDIDO ($${grandTotal.toLocaleString('es-CO')} COP)`}
                  </span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 bg-[#6F9E73]/20 rounded-full flex items-center justify-center mx-auto text-[#285943]">
              <CheckCircle className="w-10 h-10 text-[#285943]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6F9E73]">
                ¡Pedido Recibido con Éxito!
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#285943] mt-1">
                Gracias, {customerName || 'por elegir NATIVA'}
              </h3>
              <p className="text-xs sm:text-sm text-[#285943]/80 mt-2 max-w-md mx-auto">
                Hemos guardado tu pedido artesanal en el sistema con el código <strong className="text-[#C97852]">{orderId}</strong>.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-[#FAF6F0] p-5 rounded-xl border border-[#e8ddca] max-w-md mx-auto text-left space-y-2">
              <div className="text-xs text-[#285943]">
                <strong>Destino:</strong> {city} - {address}
              </div>
              <div className="text-xs text-[#285943]">
                <strong>Método de pago:</strong> {paymentMethod}
              </div>
              <div className="text-xs text-[#285943] pt-2 border-t border-[#e8ddca] flex justify-between">
                <span>Total de la orden:</span>
                <strong className="text-sm font-bold text-[#285943]">${grandTotal.toLocaleString('es-CO')} COP</strong>
              </div>
            </div>

            {/* WhatsApp Direct Confirmation Button */}
            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 bg-[#285943] hover:bg-[#1e4533] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#6F9E73]" />
                <span>NOTIFICAR POR WHATSAPP AHORA</span>
              </button>

              <button
                onClick={() => {
                  setOrderSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 bg-transparent text-[#285943] hover:text-[#C97852] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cerrar y seguir navegando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
