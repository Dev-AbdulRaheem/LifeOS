export default function ProgressBar({ value = 0, max = 100, size = 'md', className = '', color }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heights[size]} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          color || 'bg-brand-600 dark:bg-brand-500'
        }`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
