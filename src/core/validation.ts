import { ValidationResult } from '../types/simulator';

export function parseAndValidateInput(
  rawPages: string,
  rawFrames: number | string
): ValidationResult {
  // Validate Page Reference String
  const trimmed = rawPages.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a page reference string (e.g., "1 2 3 4 1 2 5 1 2 3 4 5").',
    };
  }

  // Split by whitespace, comma, or semicolons
  const tokens = trimmed.split(/[\s,;]+/).filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return {
      isValid: false,
      error: 'Invalid reference string: No valid page numbers found.',
    };
  }

  const pages: number[] = [];
  for (const token of tokens) {
    // Check if whole integer
    if (!/^-?\d+$/.test(token)) {
      return {
        isValid: false,
        error: `Invalid page value "${token}". Only non-negative integers are permitted.`,
      };
    }

    const num = Number(token);
    if (num < 0) {
      return {
        isValid: false,
        error: `Page numbers cannot be negative (${num}).`,
      };
    }

    if (num > 9999) {
      return {
        isValid: false,
        error: `Page number ${num} is too large. Please use values under 10000 for realistic simulation.`,
      };
    }

    pages.push(num);
  }

  if (pages.length > 100) {
    return {
      isValid: false,
      error: 'Page reference string exceeds 100 items. Please keep it under 100 for optimal visualization.',
    };
  }

  // Validate Frame Count
  const frameCount = typeof rawFrames === 'string' ? parseInt(rawFrames.trim(), 10) : rawFrames;

  if (isNaN(frameCount) || !Number.isInteger(frameCount)) {
    return {
      isValid: false,
      error: 'Physical frame count must be a valid integer.',
    };
  }

  if (frameCount < 1) {
    return {
      isValid: false,
      error: 'Physical frame count must be at least 1.',
    };
  }

  if (frameCount > 12) {
    return {
      isValid: false,
      error: 'Physical frame count is bounded to a maximum of 12 for clear visualization.',
    };
  }

  return {
    isValid: true,
    pages,
    capacity: frameCount,
  };
}

