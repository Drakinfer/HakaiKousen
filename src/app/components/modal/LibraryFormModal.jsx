'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from '@/app/components/Modal';

const MAX_API_UPLOAD_BYTES = 4.5 * 1024 * 1024; 

function bytesToMb(bytes) {
  return Math.round((bytes / 1024 / 1024) * 10) / 10;
}

export default function LibraryFormModal({ isOpen, onClose, document, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [source, setSource] = useState('link');
  const [warning, setWarning] = useState(null);

  const [form, setForm] = useState({
    name: '',
    icon: '',
    link: '',
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (document) {
      setForm({
        name: document.name || '',
        icon: document.icon || '',
        link: document.link || '',
      });
      setSource('link');
      setFile(null);
      setError(null);
      setWarning(null);
    } else {
      setForm({ name: '', icon: '', link: '' });
      setSource('link');
      setFile(null);
      setError(null);
      setWarning(null);
    }
  }, [document, isOpen]);

  const isEdit = !!document;

  const submitUrl = useMemo(() => {
    return isEdit ? `/api/library/${document.id}` : '/api/library';
  }, [isEdit, document]);

  const submitMethod = isEdit ? 'PUT' : 'POST';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (e) => {
    const next = e.target.value;
    setSource(next);
    setError(null);
    setWarning(null);

    if (next === 'link') {
      setFile(null);
    } else {
      setForm((prev) => ({ ...prev, link: '' }));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;

    if (!f) {
      setFile(null);
      setWarning(null);
      return;
    }

    if (f.size > MAX_API_UPLOAD_BYTES) {
      setFile(null);
      e.target.value = '';
      setSource('link');
      setWarning(
        `Ce fichier fait ${bytesToMb(f.size)} Mo : l’upload via l’API Vercel est limité (~4,5 Mo). ` +
          `Utilise un lien externe (Drive/Dropbox/site) ou un fichier plus petit.`,
      );
      setError(null);
      return;
    }

    setError(null);
    setWarning(null);
    setFile(f);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Le nom est obligatoire.';

    if (source === 'link') {
      if (!form.link.trim()) return 'Le lien est obligatoire.';
      try {
        new URL(form.link.trim());
      } catch {
        return 'Le lien doit être une URL valide.';
      }
    } else {
      if (!file) return 'Le fichier est obligatoire.';
      if (file.size > MAX_API_UPLOAD_BYTES) {
        return "Le fichier est trop volumineux pour l'upload via l’API. Utilise un lien externe.";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append('name', form.name.trim());
      if (form.icon.trim()) fd.append('icon', form.icon.trim());

      if (source === 'link') {
        fd.append('link', form.link.trim());
      } else {
        fd.append('file', file);
      }

      const res = await fetch(submitUrl, {
        method: submitMethod,
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Erreur lors de l’enregistrement du document');
      }

      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur inattendue');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifier un document' : 'Ajouter un document'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {warning && <p className="text-amber-700 text-sm">{warning}</p>}

        <div className="space-y-1">
          <label className="text-sm font-medium">Nom *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: Guide du Maître de Jeu"
            disabled={saving}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Icône (optionnel)</label>
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: file-pdf / book / scroll..."
            disabled={saving}
          />
          <p className="text-xs text-gray-500">
            Tu peux stocker un identifiant d’icône (Lucide).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Source *</label>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="source"
                value="link"
                checked={source === 'link'}
                onChange={handleSourceChange}
                disabled={saving}
              />
              Lien externe
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="source"
                value="file"
                checked={source === 'file'}
                onChange={handleSourceChange}
                disabled={saving}
              />
              Upload fichier (≤ 4 Mo via API)
            </label>
          </div>

          {source === 'link' && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Lien *</label>
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
                disabled={saving}
              />
              <p className="text-xs text-gray-500">
                Pour les gros fichiers (&gt; ~4,5 Mo), utilise un lien externe (Drive, Dropbox, etc.).
              </p>
            </div>
          )}

          {source === 'file' && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Fichier *</label>
              <input type="file" onChange={handleFileChange} className="w-full" disabled={saving} />
              <p className="text-xs text-gray-500">
                Upload via l’API : ~4,5 Mo max. Pour plus gros, passe en “Lien externe”.
              </p>

              {file && (
                <div className="text-sm">
                  <span className="font-medium">Sélectionné :</span> {file.name}{' '}
                  <span className="text-gray-500">({bytesToMb(file.size)} Mo)</span>
                </div>
              )}

              {isEdit && document?.link && (
                <p className="text-xs text-gray-500">
                  Remplacer le fichier supprimera l’ancien fichier uniquement si c’était un Blob.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setWarning(null);
              onClose();
            }}
            className="px-4 py-2 border rounded"
            disabled={saving}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-red-500 text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
