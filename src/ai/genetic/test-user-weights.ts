import { NeuralNetwork } from './NeuralNetwork';
import { getVision } from './vision';
import fs from 'fs';

const weights = JSON.parse(fs.readFileSync('user-weights.json', 'utf8'));

const nn = new NeuralNetwork([24, 16, 16, 3]);
nn.loadWeights(weights);

// Snake at (10, 10), facing RIGHT, food at (15, 10).
// Wall is at x=20.
// Distance to wall in front is 10. Distance to food is 5.
const visionRight = getVision([{x: 10, y: 10}], {x: 15, y: 10}, 'RIGHT', 20);
const outRight = nn.predict(visionRight);

const maxIdxRight = outRight.indexOf(Math.max(...outRight));
console.log('Facing RIGHT. Output:', outRight, 'Decision:', ['FORWARD', 'RIGHT', 'LEFT'][maxIdxRight]);

// Snake at (10, 10), facing UP, food at (10, 5).
const visionUp = getVision([{x: 10, y: 10}], {x: 10, y: 5}, 'UP', 20);
const outUp = nn.predict(visionUp);
const maxIdxUp = outUp.indexOf(Math.max(...outUp));
console.log('Facing UP. Output:', outUp, 'Decision:', ['FORWARD', 'RIGHT', 'LEFT'][maxIdxUp]);
