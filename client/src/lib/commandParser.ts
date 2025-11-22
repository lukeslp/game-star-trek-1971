// Command Parser for Star Trek 1971

export type CommandType =
  | 'NAV' // Navigation
  | 'SRS' // Short Range Sensors
  | 'LRS' // Long Range Sensors
  | 'PHA' // Phasers
  | 'TOR' // Photon Torpedoes
  | 'SHE' // Shields
  | 'DAM' // Damage Report
  | 'COM' // Computer (Library Computer)
  | 'HELP' // Help
  | 'QUIT'; // Quit Game

export interface ParsedCommand {
  type: CommandType;
  args: number[];
  valid: boolean;
  error?: string;
}

const COMMAND_ALIASES: Record<string, CommandType> = {
  // Navigation
  'NAV': 'NAV',
  'NAVIGATE': 'NAV',
  'MOVE': 'NAV',
  'WARP': 'NAV',

  // Sensors
  'SRS': 'SRS',
  'SR': 'SRS',
  'SHORT': 'SRS',
  'LRS': 'LRS',
  'LR': 'LRS',
  'LONG': 'LRS',

  // Weapons
  'PHA': 'PHA',
  'PHASER': 'PHA',
  'PHASERS': 'PHA',
  'TOR': 'TOR',
  'TORPEDO': 'TOR',
  'TORPEDOES': 'TOR',
  'PHOTON': 'TOR',

  // Systems
  'SHE': 'SHE',
  'SHIELD': 'SHE',
  'SHIELDS': 'SHE',
  'DAM': 'DAM',
  'DAMAGE': 'DAM',
  'STATUS': 'DAM',

  // Computer
  'COM': 'COM',
  'COMPUTER': 'COM',
  'CALC': 'COM',
  'CALCULATE': 'COM',

  // Meta
  'HELP': 'HELP',
  '?': 'HELP',
  'QUIT': 'QUIT',
  'EXIT': 'QUIT',
  'Q': 'QUIT'
};

/**
 * Parse user command input
 * Format: COMMAND [arg1] [arg2] ...
 */
export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim().toUpperCase();

  if (!trimmed) {
    return {
      type: 'HELP',
      args: [],
      valid: false,
      error: 'No command entered.'
    };
  }

  const parts = trimmed.split(/\s+/);
  const commandWord = parts[0];
  const commandType = COMMAND_ALIASES[commandWord];

  if (!commandType) {
    return {
      type: 'HELP',
      args: [],
      valid: false,
      error: `Unknown command: ${commandWord}. Type HELP for available commands.`
    };
  }

  // Parse numeric arguments
  const args: number[] = [];
  for (let i = 1; i < parts.length; i++) {
    const num = parseFloat(parts[i]);
    if (isNaN(num)) {
      return {
        type: commandType,
        args: [],
        valid: false,
        error: `Invalid number: ${parts[i]}`
      };
    }
    args.push(num);
  }

  // Validate arguments based on command type
  const validation = validateCommand(commandType, args);

  return {
    type: commandType,
    args,
    valid: validation.valid,
    error: validation.error
  };
}

/**
 * Validate command has correct number and type of arguments
 */
function validateCommand(type: CommandType, args: number[]): { valid: boolean; error?: string } {
  switch (type) {
    case 'NAV':
      if (args.length !== 2) {
        return {
          valid: false,
          error: 'Navigation requires 2 arguments: NAV <course 1-8> <warp 0.1-8>'
        };
      }
      if (args[0] < 1 || args[0] > 8) {
        return {
          valid: false,
          error: 'Course must be between 1 and 8 (1=North, clockwise)'
        };
      }
      if (args[1] < 0.1 || args[1] > 8) {
        return {
          valid: false,
          error: 'Warp factor must be between 0.1 and 8.0'
        };
      }
      break;

    case 'PHA':
      if (args.length !== 1) {
        return {
          valid: false,
          error: 'Phasers require 1 argument: PHA <energy amount>'
        };
      }
      if (args[0] < 0) {
        return {
          valid: false,
          error: 'Phaser energy must be positive'
        };
      }
      break;

    case 'TOR':
      if (args.length !== 1) {
        return {
          valid: false,
          error: 'Torpedoes require 1 argument: TOR <course 1-8>'
        };
      }
      if (args[0] < 1 || args[0] > 8) {
        return {
          valid: false,
          error: 'Torpedo course must be between 1 and 8'
        };
      }
      break;

    case 'SHE':
      if (args.length !== 1) {
        return {
          valid: false,
          error: 'Shields require 1 argument: SHE <energy amount>'
        };
      }
      if (args[0] < 0) {
        return {
          valid: false,
          error: 'Shield energy must be positive'
        };
      }
      break;

    case 'COM':
      if (args.length !== 1) {
        return {
          valid: false,
          error: 'Computer requires 1 argument: COM <1=calc distance, 2=nav data>'
        };
      }
      if (args[0] < 1 || args[0] > 2) {
        return {
          valid: false,
          error: 'Computer function must be 1 (calculate) or 2 (navigation data)'
        };
      }
      break;

    case 'SRS':
    case 'LRS':
    case 'DAM':
    case 'HELP':
    case 'QUIT':
      // These commands take no arguments
      if (args.length > 0) {
        return {
          valid: false,
          error: `${type} command takes no arguments`
        };
      }
      break;
  }

  return { valid: true };
}

/**
 * Get help text for a specific command or all commands
 */
export function getCommandHelp(commandType?: CommandType): string {
  if (!commandType) {
    return `
STAR TREK 1971 - COMMAND REFERENCE

NAVIGATION:
  NAV <course> <warp>     Navigate to new sector
                          Course: 1-8 (1=N, 2=NE, 3=E, etc.)
                          Warp: 0.1-8.0 (speed factor)

SENSORS:
  SRS                     Short Range Sensors - view current quadrant
  LRS                     Long Range Sensors - scan surrounding quadrants

WEAPONS:
  PHA <energy>            Fire phasers with specified energy
  TOR <course>            Fire photon torpedo on course 1-8

SYSTEMS:
  SHE <energy>            Transfer energy to shields
  DAM                     Damage report - check system status

COMPUTER:
  COM 1                   Calculate distance to target
  COM 2                   Display navigation data

GENERAL:
  HELP                    Show this help message
  QUIT                    Exit game

MISSION: Destroy all Klingons before time runs out!
Use starbases to refuel and repair. Dock by moving adjacent to a starbase.
    `.trim();
  }

  // Specific command help
  const helpText: Record<CommandType, string> = {
    'NAV': 'NAV <course> <warp> - Navigate ship. Course 1-8 (1=North, clockwise), Warp 0.1-8.0',
    'SRS': 'SRS - Display short range sensor scan of current quadrant',
    'LRS': 'LRS - Display long range sensor scan of surrounding quadrants',
    'PHA': 'PHA <energy> - Fire phasers with specified energy amount',
    'TOR': 'TOR <course> - Fire photon torpedo on specified course (1-8)',
    'SHE': 'SHE <energy> - Transfer energy from ship to shields',
    'DAM': 'DAM - Display damage report for all ship systems',
    'COM': 'COM <function> - Use library computer (1=calculate distance, 2=navigation)',
    'HELP': 'HELP - Display command reference',
    'QUIT': 'QUIT - Exit game'
  };

  return helpText[commandType] || 'No help available for this command.';
}

/**
 * Get formatted command examples
 */
export function getCommandExamples(): string {
  return `
EXAMPLE COMMANDS:

  NAV 1 2.5          Move north at warp 2.5
  SRS                Show current quadrant scan
  LRS                Scan surrounding quadrants
  PHA 200            Fire phasers with 200 units energy
  TOR 3              Fire torpedo east
  SHE 100            Add 100 units to shields
  DAM                Check system damage
  COM 1              Calculate distance to target
  HELP               Show all commands
  `.trim();
}
