import React, { useState } from 'react';

interface ExpandableSectionProps {
  /** The heading text displayed on the top left of the section. */
  title: string;
  /** The content that will be hidden or revealed. */
  children: React.ReactNode;
  /** If greater than 0, shows a badge indicating active items when collapsed. */
  activeIndicatorCount?: number;
  /** Optional callback. If provided and active items exist, shows a "Clear All" button. */
  onClearAll?: () => void;
  /** Whether the section should be open when the component first loads. */
  defaultExpanded?: boolean;
}

/**
 * A highly reusable progressive disclosure wrapper.
 * Hides complex UI elements behind a toggleable barrier to prevent visual clutter.
 *
 * @param props - The configuration properties.
 */
export const ExpandableSection = ({
  title,
  children,
  activeIndicatorCount = 0,
  onClearAll,
  defaultExpanded = false,
}: ExpandableSectionProps): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const hasActiveItems = activeIndicatorCount > 0;

  return (
    <div className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-4 md:p-6 mb-8 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Left Side: Title and Status Indicators */}
        <div className="flex items-center gap-3">
          <h5 className="text-lg font-bold text-gray-700 dark:text-gray-200 m-0">
            {title}
          </h5>

          {/* Only show badge if collapsed AND there are active items */}
          {!isExpanded && hasActiveItems && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              {activeIndicatorCount} Active{' '}
              {activeIndicatorCount === 1 ? 'Filter' : 'Filters'}
            </span>
          )}

          {/* Only show Clear All button if there are active items AND a callback was provided */}
          {hasActiveItems && onClearAll && (
            <button
              className="text-xs font-medium text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded transition-colors"
              onClick={onClearAll}
              aria-label={`Clear all ${activeIndicatorCount} active filters`}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Right Side: Toggle Button */}
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Hide Tools ▲' : 'Show Tools ▼'}
        </button>
      </div>

      {/* The Dynamic Children (Only rendered if expanded) */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-6 animate-in fade-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
