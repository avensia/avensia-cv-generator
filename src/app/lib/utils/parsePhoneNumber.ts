export interface ParsedPhoneNumber {
  e164: string;
  countryDialCode: string;
  national: string;
}

/**
 * Parses a phone number in E.164 format (e.g. +639760002014)
 * and returns its components.
 *
 * @param phone - The full phone number string starting with '+'
 * @returns An object containing e164, countryDialCode, and national
 */
export function parsePhoneNumber(phone: string): ParsedPhoneNumber {
  if (!phone.startsWith('+')) {
    throw new Error('Invalid phone number format. Must start with +');
  }

  // Extract the country dial code (first 3 characters for example)
  const countryDialCode = phone.substring(1, 3); // e.g., "63"

  // Extract the national part (remaining digits)
  const national = phone.substring(3); // e.g., "9760002014"

  return {
    e164: `+${countryDialCode}`,
    countryDialCode,
    national,
  };
}
