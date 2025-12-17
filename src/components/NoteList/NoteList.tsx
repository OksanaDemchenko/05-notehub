import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // 🔹 Додано Generic типи для мутації
  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      // 🔹 Інвалідуємо кеш після видалення нотатки
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.status === 'pending'} // 🔹 залишаємо status для блокування кнопки
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
