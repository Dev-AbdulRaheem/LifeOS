import { useState, useMemo } from 'react';
import { Plus, Search, Pin, Archive, Trash2, StickyNote, Tag } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Tabs from '../components/common/Tabs';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { useNotes } from '../hooks/useNotes';
import { NOTE_CATEGORIES } from '../utils/constants';
import { formatDateShort } from '../utils/dateUtils';

const categoryOptions = NOTE_CATEGORIES.map(c => ({ value: c, label: c }));

export default function NotesPage() {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes();
  const [activeTab, setActiveTab] = useState('active'); // active | archived
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: '',
  });

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesTab = activeTab === 'archived' ? n.isArchived : !n.isArchived;
      if (!matchesTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [notes, activeTab, searchQuery]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setForm({ title: '', content: '', category: 'Personal', tags: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: (note.tags || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingNote) {
      await updateNote(editingNote.id, {
        title: form.title,
        content: form.content,
        category: form.category,
        tags: tagsArray,
      });
    } else {
      await addNote({
        title: form.title,
        content: form.content,
        category: form.category,
        tags: tagsArray,
      });
    }
    setModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Capture thoughts, learnings, and meeting notes</p>
        </div>
        <Button icon={Plus} onClick={handleOpenCreate}>New Note</Button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { value: 'active', label: 'Active', count: notes.filter(n => !n.isArchived).length },
            { value: 'archived', label: 'Archived', count: notes.filter(n => n.isArchived).length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="input-field pl-10 text-sm py-1.5"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={searchQuery ? 'No matching notes' : activeTab === 'archived' ? 'No archived notes' : 'No notes yet'}
          description="Jot down quick ideas, snippets, or plans."
          actionLabel={activeTab === 'active' && !searchQuery ? '+ New Note' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative group cursor-pointer"
              onClick={() => handleOpenEdit(note)}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                      className={`p-1 rounded transition-colors ${
                        note.isPinned ? 'text-brand-600 dark:text-brand-400' : 'text-gray-300 hover:text-gray-600'
                      }`}
                      aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateNote(note.id, { isArchived: !note.isArchived })}
                      className="p-1 text-gray-300 hover:text-gray-600 rounded transition-colors"
                      aria-label={note.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingNote(note)}
                      className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line line-clamp-4 font-normal">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1 flex-wrap">
                  {(note.tags || []).map(tag => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span>{formatDateShort(note.updatedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingNote ? 'Edit Note' : 'New Note'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            placeholder="Note title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              label="Tags (comma separated)"
              placeholder="e.g. react, books, goals"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <Textarea
            label="Content"
            placeholder="Write your note here..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingNote ? 'Save Changes' : 'Create Note'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={() => deleteNote(deletingNote.id)}
        title="Delete Note"
        message={`Delete "${deletingNote?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
