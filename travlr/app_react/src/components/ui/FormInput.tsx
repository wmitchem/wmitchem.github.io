import React, { type ChangeEvent } from 'react';

/**
 * Interface defining the props for the FormInput component.
 */
interface FormInputProps {
  /** The user-facing label text displayed next to the input field. */
  label: string;
  /** The identifier name attribute for the input field. */
  name: string;
  /** The HTML input type (e.g., 'text', 'password', 'date'). Defaults to 'text'. */
  type?: string;
  /** The current value string used for controlled form states. */
  value?: string;
  /** An initial fallback value used if working with uncontrolled form data. */
  defaultValue?: string;
  /** Optional placeholder text displayed inside the empty field. */
  placeholder?: string;
  /** Flag showing if the parent form has attempted a submission trigger. */
  submitted: boolean;
  /** The specific validation error message to display when fields are empty. */
  errorMessage: string;
  /** Optional callback function to update parent state when text changes. */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Optional prefix to display currency symbols. */
  prefix?: string;
}

/**
 * Reusable form input element that handles standard styling, labels,
 * and basic missing-value error messaging.
 * Fully refactored to utilize Tailwind CSS with responsive dark mode.
 *
 * @param props - The component configuration options and state tracking properties.
 * @returns A JSX element rendering a styled input field group with conditional validation feedback.
 */
export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  submitted,
  errorMessage,
  onChange,
  prefix,
}: FormInputProps): React.JSX.Element {
  // Highlight an error if the form was submitted but the field text is falsy or missing
  const hasError = submitted && (value !== undefined ? !value : false);

  // Extracting shared Tailwind classes to keep the JSX clean
  const baseInputClasses =
    'block w-full px-4 py-2.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 shadow-sm border';

  // Conditionally apply danger (red) or standard (blue/gray) borders based on validation state
  const validationClasses = hasError
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={name}
        className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide"
      >
        {label}
      </label>

      {/* Conditionally render the Input Group if a prefix is provided */}
      {prefix ? (
        <div className="flex shadow-sm rounded-lg overflow-hidden">
          <span className="inline-flex items-center px-4 bg-gray-100 dark:bg-slate-800 border border-r-0 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">
            {prefix}
          </span>
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseInputClasses} ${validationClasses} rounded-none rounded-r-lg w-full`}
          />
        </div>
      ) : (
        /* Standard input layout without a prefix */
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputClasses} ${validationClasses} rounded-lg w-full`}
        />
      )}

      {hasError && (
        <div className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center mt-1 animate-pulse">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
