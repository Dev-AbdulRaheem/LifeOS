import { Search, Filter } from 'lucide-react';
import Select from '../common/Select';
import { TASK_CATEGORIES } from '../../utils/constants';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  ...TASK_CATEGORIES.map((c) => ({ value: c, label: c })),
];

const sortOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created' },
  { value: 'title', label: 'Title' },
];

export default function TaskFilter({ filters, onFilterChange, searchQuery, onSearchChange }) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-40">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>
        <div className="w-40">
          <Select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            options={priorityOptions}
          />
        </div>
        <div className="w-40">
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            options={categoryOptions}
          />
        </div>
        <div className="w-40">
          <Select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>
    </div>
  );
}
