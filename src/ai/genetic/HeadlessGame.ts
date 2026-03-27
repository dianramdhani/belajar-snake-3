import { NeuralNetwork } from './NeuralNetwork';
import type { Position, Direction } from '../../types/game';
import { checkCollision, checkFoodCollision } from '../../game/collision';
import { generateFood } from '../../game/food-generator';
import { moveSnake } from '../../game/grid-utils';
import { getVision } from './vision';

export class HeadlessGame {
  gridSize: number;
  network: NeuralNetwork;
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  lifespan: number;
  maxLifespan: number;
  stepsSinceLastFood: number;
  efficiencyBonus: number;

  constructor(gridSize: number, network: NeuralNetwork) {
    this.gridSize = gridSize;
    this.network = network;
    this.snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    this.food = generateFood(gridSize, this.snake);
    this.direction = 'RIGHT'; // Start direction doesn't matter much
    this.score = 0;
    this.lifespan = 0;
    this.maxLifespan = gridSize * gridSize * 2; // Prevent infinite loops
    this.stepsSinceLastFood = 0;
    this.efficiencyBonus = 0;
  }

  // Run a single simulation until the snake dies
  run(): number {
    let loops = 0;
    while (this.lifespan < this.maxLifespan && this.stepsSinceLastFood < 200) {
      if (loops++ > 2000) throw new Error('Infinite loop in HeadlessGame run()');
      const vision = getVision(this.snake, this.food, this.direction, this.gridSize);
      const output = this.network.predict(vision);

      // Output mapping: [FORWARD, RIGHT, LEFT]
      let maxIdx = 0;
      for (let i = 1; i < output.length; i++) {
        if (output[i] > output[maxIdx]) {
          maxIdx = i;
        }
      }

      let newDir = this.direction;
      if (maxIdx === 1) {
        // Turn Right
        const rightTurns: Record<Direction, Direction> = { 'UP': 'RIGHT', 'RIGHT': 'DOWN', 'DOWN': 'LEFT', 'LEFT': 'UP' };
        newDir = rightTurns[this.direction];
      } else if (maxIdx === 2) {
        // Turn Left
        const leftTurns: Record<Direction, Direction> = { 'UP': 'LEFT', 'LEFT': 'DOWN', 'DOWN': 'RIGHT', 'RIGHT': 'UP' };
        newDir = leftTurns[this.direction];
      }

      this.direction = newDir;

      const actualDelta = {
        'UP': { x: 0, y: -1 },
        'DOWN': { x: 0, y: 1 },
        'LEFT': { x: -1, y: 0 },
        'RIGHT': { x: 1, y: 0 },
      }[this.direction];

      const newHead = {
        x: this.snake[0].x + actualDelta.x,
        y: this.snake[0].y + actualDelta.y,
      };

      // Check Death
      if (checkCollision(newHead, this.snake, this.gridSize)) {
        break; // Snake died
      }

      const willEatFood = checkFoodCollision(newHead, this.food);
      this.snake = moveSnake(this.snake, this.direction, willEatFood);
      
      this.lifespan++;
      this.stepsSinceLastFood++;

      if (willEatFood) {
        this.score++;
        // Reward faster food collection to prevent "farming" by blindly spinning
        this.efficiencyBonus += (200 - this.stepsSinceLastFood) * 5;
        this.stepsSinceLastFood = 0;
        this.food = generateFood(this.gridSize, this.snake);
      }
    }

    // Calculate fitness
    let fitness = this.lifespan;

    if (this.score > 0) {
      // Exponential reward for eating food, plus efficiency bonus for hunting fast
      fitness += 1000 * Math.pow(this.score, 1.5) + this.efficiencyBonus;
    } else {
      // Gradient for getting closer to food (Manhattan distance)
      const distToFood = Math.abs(this.snake[0].x - this.food.x) + Math.abs(this.snake[0].y - this.food.y);
      // Max possible distance is gridSize * 2
      const proximityBonus = ((this.gridSize * 2) - distToFood) * 2;
      fitness += proximityBonus;
    }

    // Heavy penalty for hitting a wall early (less than 50 steps) without scoring
    if (this.lifespan < 50 && this.score === 0) {
      fitness *= 0.1;
    }

    return fitness;
  }
}
