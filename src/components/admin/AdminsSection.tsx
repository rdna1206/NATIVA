import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Power, 
  CheckCircle2, 
  X,
  Mail,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { AdminUser } from '../../types';
import { authService } from '../../services/authService';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminsSectionProps {
  admins: AdminUser[];
  currentUid?: string;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshAdmins: () => void;
}

export const AdminsSection: React.FC<AdminsSectionProps> = ({
  admins,
  currentUid,
  onShowToast,
  onRefreshAdmins
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'superadmin' | 'admin'>('admin');
  const [loading, setLoading] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminUser | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPassword.trim()) {
      onShowToast('Correo y contraseña son obligatorios.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      onShowToast('La contraseña debe tener mínimo 6 caracteres.', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.createAdmin(newEmail, newPassword, newDisplayName, newRole);
      onShowToast(`Administrador "${newEmail}" creado con éxito.`, 'success');
      setIsModalOpen(false);
      setNewEmail('');
      setNewPassword('');
      setNewDisplayName('');
      onRefreshAdmins();
    } catch (err: unknown) {
      console.error('Create admin error:', err);
      let msg = 'Error al crear la cuenta en Firebase Auth.';
      if (err instanceof Error && err.message.includes('email-already-in-use')) {
        msg = 'Este correo ya se encuentra registrado.';
      }
      onShowToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    try {
      const nextStatus = !admin.isActive;
      await authService.toggleAdminStatus(admin.uid, nextStatus);
      onShowToast(
        `Cuenta ${nextStatus ? 'activada' : 'desactivada'} para ${admin.email}.`,
        'info'
      );
      onRefreshAdmins();
    } catch (err) {
      console.error('Toggle status error:', err);
      onShowToast('Error al actualizar el estado del administrador.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await authService.deleteAdminRecord(deleteCandidate.uid);
      onShowToast(`Registro del administrador ${deleteCandidate.email} eliminado.`, 'info');
      setDeleteCandidate(null);
      onRefreshAdmins();
    } catch (err) {
      console.error('Delete admin error:', err);
      onShowToast('Error al eliminar el administrador.', 'error');
    }
  };

  return (
    <div className="space-y-6 font-montserrat">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#285943]">
            Gestión de Administradores
          </h2>
          <p className="text-xs text-[#285943]/70 mt-0.5">
            Control de accesos y roles protegidos mediante Firebase Authentication.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#285943] hover:bg-[#1e4533] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar Administrador</span>
        </button>
      </div>

      {/* Security Info Card */}
      <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-2xl border border-[#e8ddca] flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-[#285943] shrink-0 mt-0.5" />
        <div className="text-xs text-[#285943] space-y-1">
          <p className="font-bold">Seguridad y Criptografía de Credenciales</p>
          <p className="text-[#285943]/80 leading-relaxed">
            Las contraseñas de los administradores se procesan de manera segura mediante Firebase Authentication y nunca se almacenan en texto plano en la base de datos ni en el frontend. Solo usuarios autenticados tienen acceso a las funciones del panel.
          </p>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-[#e8ddca] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#e8ddca] text-[#285943] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Administrador</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddca]/60">
              {admins.map((admin) => {
                const isCurrent = admin.uid === currentUid;
                const isSuper = admin.role === 'superadmin';

                return (
                  <tr key={admin.uid} className="hover:bg-[#FAF6F0]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#285943] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#285943]/10 flex items-center justify-center text-[#285943] font-bold text-xs">
                        {admin.displayName ? admin.displayName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div>{admin.displayName || 'Administrador'}</div>
                        {isCurrent && (
                          <span className="text-[10px] text-[#C97852] font-semibold">(Tú)</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#285943] font-medium">
                      {admin.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max ${
                        isSuper ? 'bg-[#285943] text-white' : 'bg-[#6F9E73]/20 text-[#285943]'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {isSuper ? 'Superadmin' : 'Gestor'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        admin.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#285943]/70">
                      {admin.lastLogin
                        ? new Date(admin.lastLogin).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Reciente'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isCurrent && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              admin.isActive !== false
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={admin.isActive !== false ? 'Desactivar acceso' : 'Activar acceso'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteCandidate(admin)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar administrador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e8ddca] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#285943] mb-1">
              Agregar Nuevo Administrador
            </h3>
            <p className="text-xs text-[#285943]/70 mb-6">
              El nuevo administrador podrá iniciar sesión con estas credenciales.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Nombre Completo</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#285943]/50 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Ej. Laura Gómez"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden focus:border-[#285943]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#285943]/50 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="laura@nativa.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden focus:border-[#285943]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Contraseña Inicial</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#285943]/50 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden focus:border-[#285943]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Rol de Acceso</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'superadmin' | 'admin')}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden focus:border-[#285943]"
                >
                  <option value="admin">Gestor / Editor (Productos, Solicitudes, Contenido)</option>
                  <option value="superadmin">Super Administrador (Control Total)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#e8ddca] text-[#285943] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#285943] hover:bg-[#1e4533] text-white font-bold uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Creando cuenta...' : 'Crear Administrador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Eliminar Cuenta de Administrador"
        message={`¿Estás seguro de que deseas eliminar la cuenta de ${deleteCandidate?.email}? Perderá el acceso al panel inmediatamente.`}
        confirmText="Sí, Eliminar Cuenta"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCandidate(null)}
      />

    </div>
  );
};
