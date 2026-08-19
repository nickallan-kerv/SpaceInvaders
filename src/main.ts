import { GAME_CONFIG } from "./config";
import { Game } from "./core/Game";
import { InputController } from "./input/InputController";
import { CanvasRenderer } from "./render/CanvasRenderer";
import "./styles.css";

const canvas = document.getElementById("game-canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas element was not found.");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("2D rendering context was not available.");
}

canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

const renderer = new CanvasRenderer(context, GAME_CONFIG.width, GAME_CONFIG.height);
const input = new InputController(window);
const game = new Game(renderer, input);

game.start();
