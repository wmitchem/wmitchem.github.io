/**
 * A highly scalable inline SVG Pokéball placeholder.
 * Uses currentColor and Tailwind opacity/grayscale classes for easy theming.
 */
export const PokeballPlaceholder = ({ className = 'w-24 h-24 opacity-20' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
  >
    {/* Outer circle base (Light Gray) */}
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="#f3f4f6"
      stroke="#374151"
      strokeWidth="6"
    />

    {/* Top red half */}
    <path
      d="M 5 50 A 45 45 0 0 1 95 50 Z"
      fill="#ef4444"
      stroke="#374151"
      strokeWidth="6"
    />

    {/* Center horizontal band */}
    <line x1="5" y1="50" x2="95" y2="50" stroke="#374151" strokeWidth="6" />

    {/* Center outer button */}
    <circle
      cx="50"
      cy="50"
      r="14"
      fill="#f3f4f6"
      stroke="#374151"
      strokeWidth="6"
    />

    {/* Center inner button */}
    <circle cx="50" cy="50" r="5" fill="#374151" />
  </svg>
);
