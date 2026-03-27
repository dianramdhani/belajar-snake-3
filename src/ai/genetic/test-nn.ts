import { GeneticAlgorithm } from './GeneticAlgorithm';
import { getVision } from './vision';

console.log('--- Testing Genetic Algorithm ---');
const ga = new GeneticAlgorithm({
  populationSize: 500,
  mutationRate: 0.1,
  layers: [24, 16, 16, 3],
  gridSize: 20
});

console.log('Training 50 generations...');
for (let i = 0; i < 50; i++) {
  ga.nextGeneration();
  if (i % 10 === 0) {
    console.log(`Gen ${ga.generation}: Best Fitness = ${ga.bestFitness}`);
  }
}
console.log(`Gen ${ga.generation}: Best Fitness = ${ga.bestFitness}`);

const bestNN = ga.bestNetwork;
if (bestNN) {
  console.log('\n--- Testing Best NN Vision Outputs ---');
  // Scenario 1: Open space
  console.log('Scenario 1: Open space (Center of 20x20 grid, facing UP)');
  let vision = getVision([{x: 10, y: 10}], {x: 5, y: 5}, 'UP', 20);
  let output = bestNN.predict(vision);
  console.log('Outputs (Forward, Right, Left):', output);

  // Scenario 2: Wall immediately in front
  console.log('Scenario 2: Wall in front (Facing UP, at y=0)');
  vision = getVision([{x: 10, y: 0}], {x: 5, y: 5}, 'UP', 20);
  output = bestNN.predict(vision);
  console.log('Outputs (Forward, Right, Left):', output);
  
  let maxIdx = 0;
  for (let i=1; i<3; i++) if (output[i] > output[maxIdx]) maxIdx = i;
  console.log('Decision:', maxIdx === 0 ? 'FORWARD' : maxIdx === 1 ? 'RIGHT' : 'LEFT');

  // Scenario 3: Wall on Right
  console.log('Scenario 3: Wall on right (Facing UP, at x=19)');
  vision = getVision([{x: 19, y: 10}], {x: 5, y: 5}, 'UP', 20);
  output = bestNN.predict(vision);
  console.log('Outputs (Forward, Right, Left):', output);
  
  maxIdx = 0;
  for (let i=1; i<3; i++) if (output[i] > output[maxIdx]) maxIdx = i;
  console.log('Decision:', maxIdx === 0 ? 'FORWARD' : maxIdx === 1 ? 'RIGHT' : 'LEFT');
}
