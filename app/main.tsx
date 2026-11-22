import { createRoot } from 'react-dom/client';
import CrystalCity from './crystal-city';

const game = document.getElementById('game');
if (!game) throw new Error('Crystal City mount element is missing');

const mountGame = () => createRoot(game).render(<CrystalCity />);

if (document.readyState === 'complete') {
  mountGame();
} else {
  window.addEventListener('load', mountGame, { once: true });
}
