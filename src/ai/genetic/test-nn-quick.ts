import { GeneticAlgorithm } from './GeneticAlgorithm';
import { HeadlessGame } from './HeadlessGame';

console.log('--- Quick Test ---');

try {
  const ga = new GeneticAlgorithm({
    populationSize: 5,
    mutationRate: 0.1,
    layers: [24, 16, 16, 3],
    gridSize: 20
  });

  console.log('Evaluating population...');
  let i = 0;
  for (const nn of ga.population) {
    console.log(`Evaluating NN ${i++}`);
    const game = new HeadlessGame(20, nn);
    game.run();
    console.log(`Finished NN ${i-1}, Lifespan: ${game.lifespan}, Score: ${game.score}`);
  }
} catch (err) {
  console.error("ERROR CAUGHT:");
  console.error(err);
}

console.log('Done.');
