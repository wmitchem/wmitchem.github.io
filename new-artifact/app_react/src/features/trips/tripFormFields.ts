import type { Trip } from '../../types/Trip';

/**
 * Defines the configuration metadata layout for a single input field in the trip form.
 */
export interface TripFormField {
  /** The specific property name from the Trip interface that this field populates. */
  name: keyof Trip;
  /** The user-facing label text displayed next to the input field. */
  label: string;
  /** The HTML input type (e.g., 'text', 'password', 'date'). Defaults to 'text'. */
  type: string;
  /** Optional placeholder text shown inside the empty field. */
  placeholder?: string;
  /** The validation error message to display if the field fails validation. */
  errorMessage: string;
  /** Optional prefix to display currency symbols. */
  prefix?: string;
}

/**
 * Configuration registry array containing metadata for every input field needed
 * to create or update a trip entry.
 */
export const tripFormFields: TripFormField[] = [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    placeholder: 'Code',
    errorMessage: 'Trip Code is required',
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Name',
    errorMessage: 'Name is required',
  },
  {
    name: 'length',
    label: 'Length',
    type: 'text',
    placeholder: 'Length',
    errorMessage: 'Length is required',
  },
  {
    name: 'start',
    label: 'Start',
    type: 'date',
    placeholder: '',
    errorMessage: 'Date is required',
  },
  {
    name: 'resort',
    label: 'Resort',
    type: 'text',
    placeholder: 'Resort',
    errorMessage: 'Resort is required',
  },
  {
    name: 'perPerson',
    label: 'Price per Person',
    type: 'number',
    placeholder: 'e.g., 1499.00',
    errorMessage: 'Price per person is required.',
    prefix: '$',
  },
  {
    name: 'image',
    label: 'Image',
    type: 'text',
    placeholder: 'Image',
    errorMessage: 'Image is required',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Description',
    errorMessage: 'Description is required',
  },
];
