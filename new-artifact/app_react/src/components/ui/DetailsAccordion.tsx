import React, { type ReactNode } from 'react';

interface DetailsAccordionProps {
  /** The text displayed on the clickable toggle button. */
  title: string;
  /** The content revealed when the accordion is opened. */
  children: ReactNode;
}

/**
 * A lightweight, progressive-disclosure wrapper utilizing the native HTML5 <details> element.
 * Perfect for hiding secondary metrics or advanced settings until requested by the user.
 */
export const DetailsAccordion = ({
  title,
  children,
}: DetailsAccordionProps): React.JSX.Element => {
  return (
    <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700 text-left">
      <details className="group">
        <summary className="text-sm font-semibold cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors list-none flex justify-between items-center outline-none">
          <span>{title}</span>
          <span className="transition-transform duration-300 group-open:rotate-180">
            ▼
          </span>
        </summary>
        <div className="mt-3">{children}</div>
      </details>
    </div>
  );
};
