// Game State Hook for Star Trek 1971

import { useState, useCallback } from 'react';
import type { GameState, CommandResult } from '../lib/types';
import {
  initializeGame,
  navigate,
  executePhasers,
  executeTorpedo,
  adjustShields,
  shortRangeScan,
  longRangeScan,
  damageReport,
  libraryComputer,
  advanceTurn
} from '../lib/gameLogic';
import { parseCommand, getCommandHelp, getCommandExamples } from '../lib/commandParser';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  /**
   * Execute a command from user input
   */
  const executeCommand = useCallback((input: string): void => {
    const parsed = parseCommand(input);

    // Add to history
    setCommandHistory(prev => [...prev, input]);

    // Handle invalid command
    if (!parsed.valid) {
      setGameState(prev => ({
        ...prev,
        messages: [...prev.messages, '', `> ${input}`, parsed.error || 'Invalid command']
      }));
      return;
    }

    setGameState(prev => {
      let result: CommandResult;
      let newState = { ...prev };

      // Add command to messages
      newState.messages = [...newState.messages, '', `> ${input}`];

      try {
        switch (parsed.type) {
          case 'NAV':
            result = navigate(newState, parsed.args[0], parsed.args[1]);
            break;

          case 'PHA':
            result = executePhasers(newState, parsed.args[0]);
            break;

          case 'TOR':
            result = executeTorpedo(newState, parsed.args[0]);
            break;

          case 'SHE':
            result = adjustShields(newState, parsed.args[0]);
            break;

          case 'SRS':
            result = shortRangeScan(newState);
            break;

          case 'LRS':
            result = longRangeScan(newState);
            break;

          case 'DAM':
            result = damageReport(newState);
            break;

          case 'COM':
            result = libraryComputer(newState, parsed.args[0]);
            break;

          case 'HELP':
            result = {
              success: true,
              messages: getCommandHelp().split('\n')
            };
            break;

          case 'QUIT':
            result = {
              success: true,
              messages: ['Game ended by player.'],
              newState: {
                gameOver: true,
                victory: false
              }
            };
            break;

          default:
            result = {
              success: false,
              messages: ['Command not implemented.']
            };
        }

        // Apply result messages
        newState.messages = [...newState.messages, ...result.messages];

        // Apply state changes
        if (result.newState) {
          newState = { ...newState, ...result.newState };
        }

        // Advance turn if command succeeded
        if (result.success && parsed.type !== 'HELP' && parsed.type !== 'QUIT') {
          advanceTurn(newState);

          // Add time/energy status after turn
          if (!newState.gameOver) {
            newState.messages = [
              ...newState.messages,
              '',
              `Stardate: ${newState.stardate.toFixed(1)} | Energy: ${newState.ship.energy} | Time remaining: ${
                newState.timeLimit - (newState.stardate - newState.initialStardate)
              } stardates`
            ];

            // Check game over conditions
            if (newState.ship.energy <= 0 && !newState.ship.docked) {
              newState.messages = [
                ...newState.messages,
                '',
                '*** OUT OF ENERGY ***',
                'Mission failed.'
              ];
              newState.gameOver = true;
              newState.victory = false;
            }

            if (newState.stardate - newState.initialStardate >= newState.timeLimit) {
              newState.messages = [
                ...newState.messages,
                '',
                '*** TIME LIMIT EXCEEDED ***',
                `${newState.galaxy.klingonsRemaining} Klingons remain.`,
                'Mission failed.'
              ];
              newState.gameOver = true;
              newState.victory = false;
            }
          }
        }
      } catch (error) {
        newState.messages = [
          ...newState.messages,
          'Error executing command: ' + (error instanceof Error ? error.message : 'Unknown error')
        ];
      }

      return newState;
    });
  }, []);

  /**
   * Start a new game
   */
  const newGame = useCallback(() => {
    setGameState(initializeGame());
    setCommandHistory([]);
  }, []);

  /**
   * Get recent messages (last N)
   */
  const getRecentMessages = useCallback(
    (count: number = 50): string[] => {
      return gameState.messages.slice(-count);
    },
    [gameState.messages]
  );

  return {
    gameState,
    commandHistory,
    executeCommand,
    newGame,
    getRecentMessages
  };
}
