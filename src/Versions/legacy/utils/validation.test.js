import { validateEmail, validatePassword, validateName } from './validation';

describe.each([
  ['First Name'],
  ['Last Name'],
])('validateName - Legacy Version', (fieldName) => {

  test(`should return "${fieldName} is required" for empty name`, () => {
    const result = validateName('', fieldName);
    expect(result).toBe(`${fieldName} is required`);
  });

  test(`should return "${fieldName} cannot be empty" for only spaces`, () => {
    const result = validateName('   ', fieldName);
    expect(result).toBe(`${fieldName} cannot be empty`);
  });

  test(`should return "${fieldName} must be at least 2 characters long" for too short name`, () => {
    const result = validateName('a', fieldName);
    expect(result).toBe(`${fieldName} must be at least 2 characters long`);
  });

  test(`should return "${fieldName} cannot exceed 50 characters" for too long name`, () => {
    const result = validateName('a'.repeat(51), fieldName);
    expect(result).toBe(`${fieldName} cannot exceed 50 characters`);
  });

  test(`should return "${fieldName} can only contain letters, hyphens, and astrophes" for invalid chars`, () => {
    const invalidNames = [
      'John123',
      'Mary@Doe',
      'Jane#Smith',
      'Bob_Doe',
      'Test%Name',
      'A&W',
      'John.Doe',
      'Name with !',
      'Café_123',
      'Иван123',
    ];
    invalidNames.forEach(name => {
      const result = validateName(name, fieldName);
      expect(result).toBe(`${fieldName} can only contain letters, hyphens, and astrophes`);
    });
  });

  test(`should return "${fieldName} cannot contain multiple spaces" for multiple spaces in name`, () => {
    const namesWithMultipleSpaces = [
      'Jo  hn',
      'Mary   Jane',
      '  John  ',
      'Test    ',
    ];

    namesWithMultipleSpaces.forEach(name => {
      const result = validateName(name, fieldName);
      expect(result).toBe(`${fieldName} cannot contain multiple spaces`);
    });
  });

  test(`should return "${fieldName} cannot start/end with hyphen/astrophe or have consecutive special characters" for invalid formats`, () => {
    const testCases = [
      {
        description: 'names starting with hyphen',
        values: ['-John', '-Mary-Jane'],
      },
      {
        description: 'names ending with hyphen',
        values: ['John-', 'Mary-Jane-'],
      },
      {
        description: 'names starting with apostrophe',
        values: ['\'John', '\'O\'Connor'],
      },
      {
        description: 'names ending with apostrophe',
        values: ['John\'', 'Connor\''],
      },
      {
        description: 'names with consecutive special characters',
        values: ['John--Doe', 'Mary\'\'Smith', 'Jean---Pierre', 'O\'\'\'\'Connor'],
      },
      {
        description: 'names with mixed consecutive special characters',
        values: ['Test-\'Name', 'Name\'-Test', '-\'Test', 'Test\'-'],
      },
    ];

    testCases.forEach(({ description, values }) => {
      values.forEach(value => {
        const result = validateName(value, fieldName);
        expect(result)
          .toBe(`${fieldName} cannot start/end with hyphen/astrophe or have consecutive special characters`);
      });
    });
  });
});

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
      const result = validateEmail(email, 'Email');
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

describe('validatePassword - legacy version', () => {
  test('should return "Password is required" for empty password', () => {
    const result = validatePassword('', 'Password');
    expect(result).toBe('Password is required');
  });

  test('should return "Password cannot be empty" for empty password field', () => {
    const result = validatePassword('   ', 'Password');
    expect(result).toBe('Password cannot be empty');
  });

  test('should return "Password must be at least 2 characters long" for too short email', () => {
    const result = validatePassword('a', 'Password');
    expect(result).toBe('Password must be at least 2 characters long');
  });

  test('should return "Password cannot exceed 50 characters" for too long password', () => {
    const result = validatePassword('a'.repeat(51), 'Password');
    expect(result).toBe('Password cannot exceed 50 characters');
  });

  test('should return "Password should contain at least one number and one special character" for invalid password, if missing requirements', () => {
    let result = validatePassword('Password!', 'Password');
    expect(result).toBe('Password should contain at least one number and one special character');

    result = validatePassword('Password123', 'Password');
    expect(result).toBe('Password should contain at least one number and one special character');

    result = validatePassword('Password', 'Password');
    expect(result).toBe('Password should contain at least one number and one special character');
  });

  test('should return empty string for valid password', () => {
    const validPasswords = [
      'Password123!',
      'Test@1234',
      'Mypass#1234',
      'Secure999$',
    ];

    validPasswords.forEach(password => {
      const result = validatePassword(password, 'Password');
      expect(result).toBe('');
    });
  });
});