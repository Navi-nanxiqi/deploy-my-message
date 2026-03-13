import { LogLevel } from '@nestjs/common';

export function resolveLogLevels(level: string): LogLevel[] {
  switch ((level ?? 'log').toLowerCase()) {
    case 'error':
      return ['error'];
    case 'warn':
      return ['error', 'warn'];
    case 'log':
      return ['log', 'error', 'warn'];
    case 'debug':
      return ['log', 'error', 'warn', 'debug'];
    case 'verbose':
      return ['log', 'error', 'warn', 'debug', 'verbose'];
    default:
      return ['log', 'error', 'warn'];
  }
}