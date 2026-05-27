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

  return (
    <div className="form-group mb-3">
      <label className="fw-bold mb-1">{label}:</label>

      {/* Conditionally render the Input Group if a prefix is provided */}
      {prefix ? (
        <div className="input-group">
          <span className="input-group-text bg-light text-muted">{prefix}</span>
          <input
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
          />
          {/* Validation feedback sits inside the input-group for alignment */}
          {hasError && (
            <div className="invalid-feedback d-block">
              <div>{errorMessage}</div>
            </div>
          )}
        </div>
      ) : (
        /* If no prefix exists, render the standard input layout */
        <>
          <input
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
          />
          {/* Validation feedback sits inside the input-group for alignment */}
          {hasError && (
            <div className="invalid-feedback d-block">
              <div>{errorMessage}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
