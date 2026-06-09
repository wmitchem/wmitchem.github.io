/**
 * An intermediate interface to handle the condition part of the fluent query chain.
 *
 * @template T - The type of the items in the collection.
 * @template K - The specific key of the property being filtered.
 */
export interface QueryConditionAPI<T, K extends keyof T> {
  /**
   * Filters the collection for items where the property strictly equals the provided value (===).
   *
   * @param value - The exact value to match.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('generation').equals(1)
   */
  equals: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Filters the collection for items where the property strictly does not equal the provided value (!==).
   *
   * @param value - The value to exclude.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('name').notEquals('Pikachu')
   */
  notEquals: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Filters the collection for items where the property is strictly greater than the provided value (>).
   *
   * @param value - The threshold value.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('weight').greaterThan(60)
   */
  greaterThan: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Filters the collection for items where the property is greater than or equal to the provided value (>=).
   *
   * @param value - The minimum threshold value.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('weight').greaterThanOrEqual(50)
   */
  greaterThanOrEqual: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Filters the collection for items where the property is strictly less than the provided value (<).
   *
   * @param value - The threshold value.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('weight').lessThan(30)
   */
  lessThan: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Filters the collection for items where the property is less than or equal to the provided value (<=).
   *
   * @param value - The maximum threshold value.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('encounters').lessThanOrEqual(4096)
   */
  lessThanOrEqual: (value: T[K]) => CollectionQueryAPI<T>;

  /**
   * Checks if an array (or string) property includes the expected scalar value.
   *
   * @param value - The scalar value to look for inside the array or string.
   * @returns The main query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon).where('types').includes('fire')
   */
  includes: (
    value: T[K] extends (infer U)[] ? U : T[K],
  ) => CollectionQueryAPI<T>;
}

/**
 * A chainable utility interface for filtering collections of data.
 *
 * @template T - The type of the items in the collection.
 */
export interface CollectionQueryAPI<T> {
  /**
   * Targets a specific property for filtering, initiating a fluent condition chain.
   *
   * @param propertyName - The object key to inspect.
   * @returns An intermediate object containing specific comparison methods.
   * @example
   * const heavyPokemon = createCollectionQuery(allPokemon)
   * .where('weight').greaterThan(60)
   * .execute();
   */
  where<K extends keyof T>(propertyName: K): QueryConditionAPI<T, K>;

  /**
   * Sorts the collection based on a given property key.
   * Supports dot-notation for nested properties (e.g., 'stats.hp').
   *
   * @param property - The object key or dot-notation path to sort by.
   * @param direction - 'asc' for ascending, 'desc' for descending. Defaults to 'asc'.
   * @returns The query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon)
   * .sortBy('stats.speed', 'desc')
   */
  sortBy: (
    property: string,
    direction?: 'asc' | 'desc',
  ) => CollectionQueryAPI<T>;

  /**
   * Sorts the collection by search relevance using a heuristic algorithm.
   * Items starting with the search term are heavily prioritized over items
   * that merely contain the term elsewhere.
   *
   * @param property - The object key to inspect (e.g., 'name').
   * @param searchTerm - The string being searched for by the user.
   * @returns The query object to allow further method chaining.
   * @example
   * createCollectionQuery(pokemon)
   * .where('name').includes('sa')
   * .sortBySearchPriority('name', 'sa')
   */
  sortBySearchPriority: (
    property: string,
    searchTerm: string,
  ) => CollectionQueryAPI<T>;

  /**
   * Executes the accumulated query chain and returns the final transformed array.
   *
   * @returns The fully filtered and sorted dataset.
   * @example
   * const results = myQuery.execute();
   */
  execute(): T[];
}

/**
 * Initializes a new chainable query utility for filtering and sorting collections.
 * Utilizes the Fluent Builder design pattern to decouple property targeting from conditional logic.
 *
 * @template T - The type of the items in the collection.
 * @param initialData - The starting array of items to process.
 * @returns An API object allowing fluent method chaining.
 * @example
 * const fireTypes = createCollectionQuery(allPokemon)
 * .where('types').includes('fire')
 * .sortBy('name', 'asc')
 * .execute();
 */
export const createCollectionQuery = <T>(
  initialData: T[],
): CollectionQueryAPI<T> => {
  // Create a shallow copy to ensure we don't accidentally mutate the original source data
  let currentData = [...initialData];

  const query: CollectionQueryAPI<T> = {
    where: <K extends keyof T>(propertyName: K): QueryConditionAPI<T, K> => {
      // Return an object containing specific mathematical/logical filters.
      // These methods remember 'propertyName' via closure.
      return {
        equals: (value) => {
          // Keep only items that strictly match the requested value
          currentData = currentData.filter(
            (item) => item[propertyName] === value,
          );
          return query;
        },
        notEquals: (value) => {
          // Discard any items that match the requested value
          currentData = currentData.filter(
            (item) => item[propertyName] !== value,
          );
          return query;
        },
        greaterThan: (value) => {
          // Keep items numerically or alphabetically greater than the threshold
          currentData = currentData.filter(
            (item) => item[propertyName] > value,
          );
          return query;
        },
        greaterThanOrEqual: (value) => {
          currentData = currentData.filter(
            (item) => item[propertyName] >= value,
          );
          return query;
        },
        lessThan: (value) => {
          // Keep items numerically or alphabetically less than the threshold
          currentData = currentData.filter(
            (item) => item[propertyName] < value,
          );
          return query;
        },
        lessThanOrEqual: (value) => {
          currentData = currentData.filter(
            (item) => item[propertyName] <= value,
          );
          return query;
        },
        includes: (value) => {
          currentData = currentData.filter((item) => {
            const itemValue = item[propertyName];

            // Handle checking inside arrays (e.g., checking if 'types' array includes 'fire')
            if (Array.isArray(itemValue)) {
              return itemValue.includes(value as any);
            }
            // Fallback for strings (e.g., checking if 'name' string includes a search chunk)
            if (typeof itemValue === 'string' && typeof value === 'string') {
              return itemValue.toLowerCase().includes(value.toLowerCase());
            }
            // If the property is neither an array nor a string, it fails the inclusion check
            return false;
          });
          return query;
        },
      };
    },

    sortBy: (property: string, direction: 'asc' | 'desc' = 'asc') => {
      // Split by '.' to allow sorting by nested objects (like 'stats.hp')
      const pathParts = property.split('.');

      currentData.sort((a: any, b: any) => {
        // Traverse the object layers to find the actual value we want to compare
        const valA = pathParts.reduce((acc, part) => acc && acc[part], a);
        const valB = pathParts.reduce((acc, part) => acc && acc[part], b);

        // Safely sink undefined or missing values to the bottom of the list
        if (valA === undefined && valB !== undefined) return 1;
        if (valA !== undefined && valB === undefined) return -1;
        if (valA === undefined && valB === undefined) return 0;

        // Perform standard lexicographical or numeric comparison
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      return query;
    },

    sortBySearchPriority: (property: string, searchTerm: string) => {
      // If the search bar is empty, bypass the sorting algorithm entirely
      if (!searchTerm) return query;

      // Normalize the search term to lowercase to ensure case-insensitive matching
      const lowerSearch = searchTerm.toLowerCase();

      currentData.sort((a: any, b: any) => {
        // Safely extract the property values, defaulting to empty strings if missing
        const valA = String(a[property] || '').toLowerCase();
        const valB = String(b[property] || '').toLowerCase();

        // Tier 1: Determine if the items exactly start with the user's input
        const aStarts = valA.startsWith(lowerSearch);
        const bStarts = valB.startsWith(lowerSearch);

        // Tier 2: Heavily prioritize the item that starts with the term (e.g., Sandslash > Bulbasaur)
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Tier 3: If both are exact prefixes, or neither are exact prefixes,
        // fall back to a clean alphabetical sort.
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });

      return query;
    },

    execute: () => {
      // Return the final, fully-processed array to the UI
      return currentData;
    },
  };

  return query;
};
