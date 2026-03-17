import { GameProvider, useGame } from './context/GameContext';
import Garden from './components/Garden';
import SetupFlow from './components/SetupFlow';
import MainMenu from './components/MainMenu';
import FreePlayMode from './components/FreePlayMode';
import GuidedMode from './components/GuidedMode';
import Collection from './components/Collection';
import ArtGenerator from './components/ArtGenerator';
import SpellingMode from './components/SpellingMode';

function GameRouter() {
  const { state } = useGame();

  return (
    <>
      <Garden />
      {state.mode === 'setup' && <SetupFlow />}
      {state.mode === 'menu' && <MainMenu />}
      {state.mode === 'freeplay' && <FreePlayMode />}
      {state.mode === 'guided' && <GuidedMode />}
      {state.mode === 'collection' && <Collection />}
      {state.mode === 'artgen' && <ArtGenerator />}
      {state.mode === 'spelling' && <SpellingMode />}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
