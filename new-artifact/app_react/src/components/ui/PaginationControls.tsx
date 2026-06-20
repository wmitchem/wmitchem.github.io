/**
 * Properties for configuring the PaginationControls component.
 * By keeping these properties generic (numbers and basic callbacks),
 * this component remains entirely decoupled from the Pokémon domain.
 */
interface PaginationControlsProps {
  /** The currently active page number. */
  currentPage: number;
  /** The total number of pages available based on the current dataset and limit. */
  totalPages: number;
  /** The number of items displayed per page. */
  itemsPerPage: number;
  /**
   * Callback fired when the user clicks 'Previous' or 'Next'.
   *
   * @param newPage - The calculated target page number.
   */
  onPageChange: (newPage: number) => void;
  /**
   * Callback fired when the user selects a new items-per-page limit.
   *
   * @param newLimit - The new numeric limit selected from the dropdown.
   */
  onLimitChange: (newLimit: number) => void;
}

/**
 * A highly reusable, presentational ("dumb") pagination component.
 *
 * I extracted this UI out of the main database controller to adhere to the
 * Single Responsibility Principle. Because it only relies on raw numbers and generic
 * callbacks, I can seamlessly reuse this exact same pagination UI later for the
 * Trips Dashboard or the Shiny Hunts gallery without rewriting any code.
 *
 * @param props - The PaginationControlsProps configuration object.
 * @example
 * <PaginationControls
 * currentPage={1}
 * totalPages={10}
 * itemsPerPage={25}
 * onPageChange={(page) => setURLParam('page', page)}
 * onLimitChange={(limit) => setURLParam('limit', limit)}
 * />
 */
export const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps): React.JSX.Element => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
      {/* --- Items Per Page Dropdown --- */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="itemsPerPage"
          className="font-medium text-gray-700 dark:text-gray-300"
        >
          Results per page:
        </label>
        <select
          id="itemsPerPage"
          className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
          value={itemsPerPage}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* --- Page Navigation Buttons --- */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <button
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>

        {/* Current Page Readout */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
        </span>

        {/* Next Button */}
        <button
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          // FIXED: Added totalPages as the second argument to Math.min!
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};
