import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { PRIORITIES, TASK_CATEGORIES, TASK_STATUS } from '../../utils/constants';
import { getTodayString } from '../../utils/dateUtils';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const categoryOptions = TASK_CATEGORIES.map((c) => ({ value: c, label: c }));

export default function TaskForm({ task, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Other',
    status: 'todo',
    dueDate: getTodayString(),
    dueTime: '',
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'Other',
        status: task.status || 'todo',
        dueDate: task.dueDate || getTodayString(),
        dueTime: task.dueTime || '',
      });
    }
  }, [task]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={form.title}
        onChange={handleChange('title')}
        error={errors.title}
        placeholder="What needs to be done?"
        autoFocus
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={handleChange('description')}
        placeholder="Add details..."
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={form.priority}
          onChange={handleChange('priority')}
          options={priorityOptions}
        />
        <Select
          label="Category"
          value={form.category}
          onChange={handleChange('category')}
          options={categoryOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={handleChange('dueDate')}
        />
        <Input
          label="Due Time"
          type="time"
          value={form.dueTime}
          onChange={handleChange('dueTime')}
        />
      </div>
      {task && (
        <Select
          label="Status"
          value={form.status}
          onChange={handleChange('status')}
          options={statusOptions}
        />
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
