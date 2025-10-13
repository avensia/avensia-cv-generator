'use client';
import { parsePhoneNumber } from '@/app/lib/utils/parsePhoneNumber';
import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import * as React from 'react';

type CountryOption = {
  iso2: string;
  name: string;
  dialCode: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { iso2: 'PH', name: 'Philippines (+63)', dialCode: '63', min: 9, max: 10 },
  { iso2: 'SE', name: 'Sweden (+46)', dialCode: '46', min: 7, max: 10 },
  { iso2: 'NO', name: 'Norway (+47)', dialCode: '47', min: 8, max: 8 },
  { iso2: 'US', name: 'United States (+1)', dialCode: '1', min: 10, max: 10 },
];

export type PhoneFieldValue = {
  e164: string;
  countryDialCode: string;
  national: string;
  valid: boolean;
  error?: string;
};

type Props = {
  label?: string;
  defaultCountryDialCode?: string;
  value?: string; // external e.164 (optional)
  onChange?: (v: PhoneFieldValue) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
};

const digitsOnly = (s: string) => s.replace(/\D+/g, '');

function validate(countryDialCode: string, nationalRaw: string) {
  const national = digitsOnly(nationalRaw);
  const country = COUNTRY_OPTIONS.find(c => c.dialCode === countryDialCode);
  const min = country?.min ?? 6,
    max = country?.max ?? 15;
  if (!national) return { valid: false, error: 'Enter a phone number' };
  if (national.startsWith('0')) return { valid: false, error: 'Remove leading 0 when using country code' };
  if (national.length < min) return { valid: false, error: `Too short (min ${min})` };
  if (national.length > max) return { valid: false, error: `Too long (max ${max})` };
  if (country?.pattern && !country.pattern.test(national))
    return { valid: false, error: 'Number format is invalid for selected country' };
  return { valid: true, error: undefined };
}

export default function PhoneField({
  label = 'Phone',
  defaultCountryDialCode = '63',
  value,
  onChange,
  required,
  disabled,
  name,
  className,
}: Props) {
  const parsed = React.useMemo(() => parsePhoneNumber(value ?? ''), [value]);

  const [countryDialCode, setCountryDialCode] = React.useState(parsed?.countryDialCode ?? defaultCountryDialCode);
  const [national, setNational] = React.useState(parsed?.national ?? '');
  const [touched, setTouched] = React.useState(false);

  // If parent changes `value` externally, sync it (guarded to avoid loops)
  React.useEffect(() => {
    if (!parsed) return;
    const nextDial = parsed.countryDialCode ?? defaultCountryDialCode;
    const nextNat = parsed.national ?? '';
    if (nextDial !== countryDialCode) setCountryDialCode(nextDial);
    if (nextNat !== national) setNational(nextNat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, defaultCountryDialCode]); // intentionally NOT depending on local state

  const buildPayload = (cd: string, n: string): PhoneFieldValue => {
    const natDigits = digitsOnly(n);
    const e164 = `+${cd}${natDigits}`;
    const { valid, error } = validate(cd, natDigits);
    return { e164, countryDialCode: cd, national: natDigits, valid, error };
  };

  const handleCountryChange = (cd: string) => {
    setCountryDialCode(cd);
    onChange?.(buildPayload(cd, national));
  };

  const handleNationalChange = (val: string) => {
    const cleaned = val.replace(/[^\d\s\-()]/g, '');
    setNational(cleaned);
    onChange?.(buildPayload(countryDialCode, cleaned));
  };

  const preview = `+${countryDialCode}${digitsOnly(national)}`;
  const { valid, error } = validate(countryDialCode, national);

  return (
    <FieldSet className={className}>
      <FieldGroup>
        <FieldLabel className="mb-1 block text-sm font-medium text-gray-800">{label}</FieldLabel>
        <div className="flex gap-2">
          <div className="w-44">
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              value={countryDialCode}
              onChange={e => handleCountryChange(e.target.value)}
              disabled={disabled}
              aria-label="Country calling code"
            >
              {COUNTRY_OPTIONS.map(c => (
                <option key={c.iso2} value={c.dialCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9\s\-()]*"
            className={`flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none ${
              touched && !valid ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
            value={national}
            onChange={e => handleNationalChange(e.target.value)}
            onBlur={() => setTouched(true)}
            required={required}
            disabled={disabled}
            name={name}
          />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Saved as <span className="font-mono">{preview}</span>
          </p>
          {touched && !valid && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
