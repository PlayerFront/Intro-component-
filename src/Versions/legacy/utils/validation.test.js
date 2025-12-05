// import { email } from 'zod';
import { validateEmail } from './validation';

describe('validateEmail - Legacy Version', () => {
  test('should return "Email is required" for empty email', () => {
    const result = validateEmail('', 'Email');
    expect(result).toBe('Email is required');
  });

  test('should return "Email cannot be empty" for only spaces', () => {
    const result = validateEmail('    ', 'Email');
    expect(result).toBe('Email cannot be empty');
  });

  test('should return "Email must be at least 2 characters long" for too short email', () => {
    const result = validateEmail('a', 'Email');
    expect(result).toBe('Email must be at least 2 characters long');
  });

  test('should return "Looks like this is not an Email" for invalid email', () => {
    const invalidEmails = [
      'plainaddress',
      '@domain.com',
      'user@.com',
      'user@domain.',
    ];

    invalidEmails.forEach(email => {
      const result =  validateEmail(email, 'Email');
      expect(result).toBe('Looks like this is not an Email');
    });
  });

  test('should return empty string for valid email', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
    ];

    validEmails.forEach(email => {
      const result = validateEmail(email, 'Email');
      expect(result).toBe('');
    });
  });
});