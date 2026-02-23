export const AUTH_DEFAULTS = {
  loginToken: 'mock_jwt_token_123',
  registerTokenPrefix: 'mock_jwt_token_',
};

export const createLoginMockUser = (username) => ({
  id: 1,
  username,
  email: `${username}@duelodehuevos.com`,
  rankPoints: 1250,
  wins: 23,
  losses: 12,
  gold: 2450,
  avatar: null,
});

export const createRegisterMockUser = (username, email) => ({
  id: Date.now(),
  username,
  email,
  rankPoints: 0,
  wins: 0,
  losses: 0,
  gold: 1000,
  avatar: null,
});
