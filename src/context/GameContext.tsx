import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  kawaiiStyle: {
    baseColor: string;
    accentColor: string;
    eyes: 'round' | 'sparkle' | 'sleepy' | 'happy';
    accessory?: string;
  };
  photoUrl?: string;
}

export interface GameState {
  playerName: string;
  playerAge: number;
  playerAvatar: string;
  playerPhotoUrl?: string;
  family: FamilyMember[];
  mode: 'setup' | 'menu' | 'freeplay' | 'guided' | 'collection' | 'artgen';
  collectedAnimals: string[];
  currentStreak: number;
  totalKeysPressed: number;
  guidedTarget: string | null;
  guidedScore: number;
  guidedRound: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  setupComplete: boolean;
}

type GameAction =
  | { type: 'SET_PLAYER'; name: string; age: number }
  | { type: 'SET_PLAYER_PHOTO'; photoUrl: string }
  | { type: 'SET_PLAYER_AVATAR'; avatar: string }
  | { type: 'ADD_FAMILY'; member: FamilyMember }
  | { type: 'REMOVE_FAMILY'; id: string }
  | { type: 'SET_MODE'; mode: GameState['mode'] }
  | { type: 'COLLECT_ANIMAL'; letter: string }
  | { type: 'KEY_PRESSED' }
  | { type: 'SET_GUIDED_TARGET'; letter: string }
  | { type: 'GUIDED_CORRECT' }
  | { type: 'GUIDED_WRONG' }
  | { type: 'RESET_GUIDED' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'COMPLETE_SETUP' }
  | { type: 'LOAD_STATE'; state: GameState };

const initialState: GameState = {
  playerName: '',
  playerAge: 5,
  playerAvatar: '🐼',
  family: [],
  mode: 'setup',
  collectedAnimals: [],
  currentStreak: 0,
  totalKeysPressed: 0,
  guidedTarget: null,
  guidedScore: 0,
  guidedRound: 0,
  soundEnabled: true,
  musicEnabled: true,
  setupComplete: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, playerName: action.name, playerAge: action.age };
    case 'SET_PLAYER_PHOTO':
      return { ...state, playerPhotoUrl: action.photoUrl };
    case 'SET_PLAYER_AVATAR':
      return { ...state, playerAvatar: action.avatar };
    case 'ADD_FAMILY':
      return { ...state, family: [...state.family, action.member] };
    case 'REMOVE_FAMILY':
      return { ...state, family: state.family.filter(f => f.id !== action.id) };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'COLLECT_ANIMAL':
      if (state.collectedAnimals.includes(action.letter)) return state;
      return { ...state, collectedAnimals: [...state.collectedAnimals, action.letter] };
    case 'KEY_PRESSED':
      return { ...state, totalKeysPressed: state.totalKeysPressed + 1 };
    case 'SET_GUIDED_TARGET':
      return { ...state, guidedTarget: action.letter };
    case 'GUIDED_CORRECT':
      return {
        ...state,
        guidedScore: state.guidedScore + 1,
        guidedRound: state.guidedRound + 1,
        currentStreak: state.currentStreak + 1,
      };
    case 'GUIDED_WRONG':
      return { ...state, currentStreak: 0 };
    case 'RESET_GUIDED':
      return { ...state, guidedScore: 0, guidedRound: 0, currentStreak: 0 };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'TOGGLE_MUSIC':
      return { ...state, musicEnabled: !state.musicEnabled };
    case 'COMPLETE_SETUP':
      return { ...state, setupComplete: true, mode: 'menu' };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

function loadSavedState(): GameState {
  try {
    const saved = localStorage.getItem('kawaii-keys-state');
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) };
    }
  } catch { /* ignore */ }
  return initialState;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, loadSavedState);

  // Auto-save state changes
  useEffect(() => {
    localStorage.setItem('kawaii-keys-state', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
