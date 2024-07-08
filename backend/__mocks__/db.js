const mockDb = {
    execute: jest.fn(),
    getConnection: jest.fn((callback) => callback(null, { release: jest.fn() })),
    promise: jest.fn(() => mockDb),
  };
  
  module.exports = mockDb;
  