import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  Trash2, 
  ExternalLink, 
  MessageSquare,
  X,
  Mail,
  MapPin,
  Calendar,
  Send
} from 'lucide-react';
import { CustomerRequest, RequestStatus } from '../../types';
import { requestService } from '../../services/requestService';
import { ConfirmDialog } from './ConfirmDialog';

interface RequestsSectionProps {
  requests: CustomerRequest[];
  selectedRequest: CustomerRequest | null;
  onSelectRequest: (req: CustomerRequest | null) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const RequestsSection: React.FC<RequestsSectionProps> = ({
  requests,
  selectedRequest,
  onSelectRequest,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [deleteCandidate, setDeleteCandidate] = useState<CustomerRequest | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerPhone.includes(searchTerm) ||
      r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    try {
      await requestService.updateStatus(requestId, newStatus);
      onShowToast(`Estado actualizado a: ${newStatus}`, 'success');
      if (selectedRequest && selectedRequest.id === requestId) {
        onSelectRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err) {
      console.error('Status change error:', err);
      onShowToast('Error al actualizar el estado en Firebase.', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    setSavingNotes(true);
    try {
      await requestService.updateStatus(selectedRequest.id, selectedRequest.status, editNotes);
      onShowToast('Notas actualizadas correctamente.', 'success');
      onSelectRequest({ ...selectedRequest, notes: editNotes });
    } catch (err) {
      console.error('Save notes error:', err);
      onShowToast('Error al guardar las notas.', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await requestService.deleteRequest(deleteCandidate.id);
      onShowToast('Solicitud eliminada.', 'info');
      if (selectedRequest?.id === deleteCandidate.id) {
        onSelectRequest(null);
      }
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Delete request error:', err);
      onShowToast('Error al eliminar la solicitud.', 'error');
    }
  };

  const generateWhatsAppLink = (req: CustomerRequest) => {
    const cleanPhone = req.customerPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
    const text = encodeURIComponent(
      `Hola ${req.customerName}, te saludamos de NATIVA - Productos Naturales. Hemos recibido tu solicitud para "${req.productName}" (x${req.quantity}). ¿Cómo podemos coordinar tu entrega?`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  return (
    <div className="space-y-6 font-montserrat">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#285943]">
            Solicitudes de Productos ({requests.length})
          </h2>
          <p className="text-xs text-[#285943]/70 mt-0.5">
            Pedidos y prospectos recibidos mediante el formulario «QUIERO MI PRODUCTO».
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#285943] bg-[#FAF6F0] px-3 py-1.5 rounded-lg border border-[#e8ddca]">
            {requests.filter(r => r.status === 'pendiente').length} pendientes
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#285943]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, correo o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-[#e8ddca] text-xs font-medium text-[#285943] outline-hidden focus:border-[#285943]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#e8ddca]">
          {(['all', 'pendiente', 'contactada', 'completada'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#285943] text-white'
                  : 'text-[#285943]/70 hover:text-[#285943] hover:bg-[#FAF6F0]'
              }`}
            >
              {st === 'all' ? 'Todas' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#e8ddca] shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-[#285943]/60 text-xs">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#285943]" />
            <p className="font-bold text-sm text-[#285943]">No se encontraron solicitudes</p>
            <p className="text-[11px] text-[#285943]/60 mt-1">
              {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Las nuevas solicitudes de compra aparecerán aquí.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] border-b border-[#e8ddca] text-[#285943] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Teléfono / Email</th>
                  <th className="py-3 px-4">Producto Solicitado</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddca]/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF6F0]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#285943]">
                      {req.customerName}
                      {req.customerCity && (
                        <span className="block text-[10px] font-normal text-[#285943]/60">
                          📍 {req.customerCity}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#285943]">
                      <div className="font-semibold">{req.customerPhone}</div>
                      <div className="text-[10px] text-[#285943]/60">{req.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#285943]">
                      <span className="font-bold">{req.productName}</span>
                      <span className="text-[10px] text-[#6F9E73] font-bold ml-1">
                        (x{req.quantity})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#285943]">
                      ${(req.total || 0).toLocaleString('es-CO')} COP
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border outline-hidden cursor-pointer ${
                          req.status === 'completada'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : req.status === 'contactada'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-[#C97852]/20 text-[#C97852] border-[#C97852]/40'
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="contactada">Contactada</option>
                        <option value="completada">Completada</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#285943]/70">
                      {new Date(req.createdAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={generateWhatsAppLink(req)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => {
                            onSelectRequest(req);
                            setEditNotes(req.notes || '');
                          }}
                          className="px-2.5 py-1.5 bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] font-bold rounded-md text-[11px] transition-colors cursor-pointer"
                        >
                          Ver
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(req)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Eliminar solicitud"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e8ddca] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onSelectRequest(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-[#e8ddca]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6F9E73] block mb-1">
                Detalle de Solicitud
              </span>
              <h3 className="text-xl font-bold text-[#285943]">
                {selectedRequest.customerName}
              </h3>
              <p className="text-xs text-[#285943]/60">
                Registrado el {new Date(selectedRequest.createdAt).toLocaleString('es-CO')}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Product Info Box */}
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#e8ddca]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#C97852]">Producto</span>
                    <h4 className="text-base font-bold text-[#285943]">{selectedRequest.productName}</h4>
                    <p className="text-xs text-[#285943]/70">Cantidad: {selectedRequest.quantity} unidad(es)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-[#285943]/60">Valor Estimado</span>
                    <p className="text-lg font-extrabold text-[#285943]">
                      ${(selectedRequest.total || 0).toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#e8ddca]">
                  <span className="text-[10px] font-bold uppercase text-[#285943]/60 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#6F9E73]" /> Teléfono / WhatsApp
                  </span>
                  <p className="font-bold text-sm text-[#285943] mt-1">{selectedRequest.customerPhone}</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[#e8ddca]">
                  <span className="text-[10px] font-bold uppercase text-[#285943]/60 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#6F9E73]" /> Correo Electrónico
                  </span>
                  <p className="font-bold text-xs text-[#285943] mt-1 break-all">{selectedRequest.customerEmail}</p>
                </div>
              </div>

              {/* Shipping Address if given */}
              {(selectedRequest.customerCity || selectedRequest.customerAddress) && (
                <div className="p-3 bg-white rounded-lg border border-[#e8ddca]">
                  <span className="text-[10px] font-bold uppercase text-[#285943]/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C97852]" /> Dirección de Entrega
                  </span>
                  <p className="font-semibold text-xs text-[#285943] mt-1">
                    {selectedRequest.customerAddress} {selectedRequest.customerCity && `(${selectedRequest.customerCity})`}
                  </p>
                </div>
              )}

              {/* Notes / Internal Comments */}
              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">
                  Notas de Seguimiento del Administrador
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Escribe notas sobre la llamada, envío o pago del cliente..."
                  className="w-full p-3 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-xs text-[#285943] outline-hidden focus:border-[#285943]"
                />
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3.5 py-1.5 bg-[#285943] hover:bg-[#1e4533] text-white font-bold rounded-md text-[11px] cursor-pointer"
                  >
                    {savingNotes ? 'Guardando...' : 'Guardar Notas'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e8ddca] flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppLink(selectedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>

                <button
                  onClick={() => onSelectRequest(null)}
                  className="px-5 py-3 bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Eliminar Solicitud"
        message={`¿Estás seguro de que deseas eliminar la solicitud de "${deleteCandidate?.customerName}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCandidate(null)}
      />

    </div>
  );
};
