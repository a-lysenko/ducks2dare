describe('Username validation regex', () => {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  test('validates a correct username', () => {
    const validUsernames = [
      'TestUser1!',
      'Valid123@',
      'User_1234!',
      'Passw0rd!',
      'A1b2C3d4!'
    ];

    validUsernames.forEach(username => {
      expect(regex.test(username)).toBe(true);
    });
  });

test('invalidates an incorrect username', () => {
	const invalidUsernames = [
	  'testuser1',    // No uppercase letter
	  'TESTUSER1',    // No lowercase letter
	  'TestUser',     // No digit
	  'TestUser1',    // No special character
	  'Test1!',       // Less than 8 characters
	  '12345678!',    // No uppercase letter
	];

	invalidUsernames.forEach(username => {
	  expect(regex.test(username)).toBe(false);
	});
  });
});