import { useAppData } from '../context/AppDataContext';

export function useNotes() {
  const { notes, addNote, updateNote, deleteNote, loading } = useAppData();

  const pinnedNotes = notes.filter((n) => n.isPinned && !n.isArchived);
  const activeNotes = notes.filter((n) => !n.isArchived);
  const archivedNotes = notes.filter((n) => n.isArchived);

  return {
    notes,
    pinnedNotes,
    activeNotes,
    archivedNotes,
    addNote,
    updateNote,
    deleteNote,
    loading,
  };
}
