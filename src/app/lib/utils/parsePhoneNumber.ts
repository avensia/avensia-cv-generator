export interface ParsedPhoneNumber {
  e164: string;
  countryDialCode: string;
  national: string;
}

/**
 * Parses a phone number in E.164 format (e.g. +639760002014)
 * and returns its components, or undefined if input is invalid.
 *
 * @param phone - The full phone number string starting with '+'
 * @returns An object containing e164, countryDialCode, and national, or undefined
 */
export function parsePhoneNumber(phone?: string): ParsedPhoneNumber | undefined {
  // Handle undefined, null, or non-string input
  if (!phone || typeof phone !== 'string') {
    console.warn('parsePhoneNumber: input is undefined or not a string.');
    return undefined;
  }

  // Ensure it starts with '+'
  if (!phone.startsWith('+')) {
    console.warn('parsePhoneNumber: Invalid phone number format. Must start with +');
    return undefined;
  }

  // Basic validation — check length
  if (phone.length < 4) {
    console.warn('parsePhoneNumber: Phone number too short.');
    return undefined;
  }

  // Extract the country dial code (for simplicity, assume up to 3 digits)
  const countryDialCode = phone.substring(1, 3); // e.g., "63"

  // Extract the national part (remaining digits)
  const national = phone.substring(3); // e.g., "9760002014"

  return {
    e164: phone,
    countryDialCode,
    national,
  };
}
