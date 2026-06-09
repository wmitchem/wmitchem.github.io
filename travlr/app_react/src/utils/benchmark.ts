import { createCollectionQuery } from './collectionQuery.ts';

// 1. Generate a massive mock dataset
console.log('Generating 100,000 mock records...');
const mockData = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  name: `Pokemon_${i}`,
  stats: {
    hp: Math.floor(Math.random() * 200),
    speed: Math.floor(Math.random() * 150),
  },
  types: i % 2 === 0 ? ['fire', 'flying'] : ['water'],
  generation: (i % 8) + 1,
}));

console.log('Dataset generated. Starting benchmarks...\n');

// 2. Helper function to measure execution time
const runBenchmark = (testName: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`${testName} took ${(end - start).toFixed(2)} milliseconds.`);
};

// --- Test 1: Simple Filtering ---
runBenchmark('1. Simple Filter (.where)', () => {
  createCollectionQuery(mockData).where('generation', '===', 4).execute();
});

// --- Test 2: Array Inclusion Filtering ---
runBenchmark('2. Array Inclusion (.where includes)', () => {
  createCollectionQuery(mockData).where('types', 'includes', 'fire').execute();
});

// --- Test 3: Nested Sorting ---
runBenchmark('3. Nested Property Sorting (.sortBy)', () => {
  createCollectionQuery(mockData).sortBy('stats.speed', 'desc').execute();
});

// --- Test 4: Complex Chaining ---
runBenchmark('4. Complex Chain (where + where + sortBy)', () => {
  createCollectionQuery(mockData)
    .where('generation', '>=', 2)
    .where('types', 'includes', 'water')
    .sortBy('stats.hp', 'asc')
    .execute();
});
