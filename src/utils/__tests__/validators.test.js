import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidCreditCard,
  isValidZipCode,
} from '../validators';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('a.b+c@d.co')).toBe(true);
    expect(isValidEmail('  user@test.org  ')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('no-at-sign')).toBe(false);
    expect(isValidEmail('@no-local.com')).toBe(false);
    expect(isValidEmail('no-domain@')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('accepts valid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('(123) 456-7890')).toBe(true);
    expect(isValidPhone('+1-555-555-5555')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone(null)).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('accepts strong passwords', () => {
    expect(isStrongPassword('Abcdef1g')).toBe(true);
    expect(isStrongPassword('StrongP4ss')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(isStrongPassword('short1A')).toBe(false); // too short
    expect(isStrongPassword('alllowercase1')).toBe(false); // no uppercase
    expect(isStrongPassword('ALLUPPERCASE1')).toBe(false); // no lowercase
    expect(isStrongPassword('NoDigitsHere')).toBe(false); // no digit
    expect(isStrongPassword(null)).toBe(false);
    expect(isStrongPassword('')).toBe(false);
  });
});

describe('isValidCreditCard', () => {
  it('validates cards using Luhn algorithm', () => {
    // Test Visa number
    expect(isValidCreditCard('4111111111111111')).toBe(true);
    // With spaces
    expect(isValidCreditCard('4111 1111 1111 1111')).toBe(true);
    // With dashes
    expect(isValidCreditCard('4111-1111-1111-1111')).toBe(true);
  });

  it('rejects invalid card numbers', () => {
    expect(isValidCreditCard('1234567890123456')).toBe(false);
    expect(isValidCreditCard('123')).toBe(false);
    expect(isValidCreditCard('')).toBe(false);
    expect(isValidCreditCard(null)).toBe(false);
  });
});

describe('isValidZipCode', () => {
  it('accepts valid US zip codes', () => {
    expect(isValidZipCode('12345')).toBe(true);
    expect(isValidZipCode('12345-6789')).toBe(true);
    expect(isValidZipCode('  12345  ')).toBe(true);
  });

  it('rejects invalid zip codes', () => {
    expect(isValidZipCode('1234')).toBe(false);
    expect(isValidZipCode('abcde')).toBe(false);
    expect(isValidZipCode('')).toBe(false);
    expect(isValidZipCode(null)).toBe(false);
  });
});
