import { NeuralNetwork } from './NeuralNetwork';
import { getVision } from './vision';
import fs from 'fs';

const weights = JSON.parse(fs.readFileSync('user-weights.json', 'utf8'));

const nn = new NeuralNetwork([24, 16, 16, 3]);
nn.loadWeights(weights);

const visionFrontWall = getVision([{x: 10, y: 19}], {x: 5, y: 5}, 'DOWN', 20);
const outFrontWall = nn.predict(visionFrontWall);
const maxIdxFront = outFrontWall.indexOf(Math.max(...outFrontWall));
console.log('Wall in front. Output:', outFrontWall, 'Decision:', ['FORWARD', 'RIGHT', 'LEFT'][maxIdxFront]);

const visionFoodRight = getVision([{x: 10, y: 10}], {x: 15, y: 10}, 'UP', 20);
const outFoodRight = nn.predict(visionFoodRight);
const maxIdxFoodRight = outFoodRight.indexOf(Math.max(...outFoodRight));
console.log('Food to the right. Output:', outFoodRight, 'Decision:', ['FORWARD', 'RIGHT', 'LEFT'][maxIdxFoodRight]);
