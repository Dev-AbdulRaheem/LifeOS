import Modal from '../common/Modal';
import TaskForm from './TaskForm';
import { useTasks } from '../../hooks/useTasks';
import { useState } from 'react';

export default function TaskModal({ isOpen, onClose, task = null }) {
  const { addTask, updateTask } = useTasks();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (task) {
        await updateTask(task.id, data);
      } else {
        await addTask(data);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
      size="md"
    >
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={saving}
      />
    </Modal>
  );
}
