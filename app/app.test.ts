import { buildApp } from './app';

const mockCreate = jest.fn();
const mockCount = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    counter: {
      create: mockCreate,
      count: mockCount,
    },
  })),
}));

describe('GET /ping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with counter count when database is available', async () => {
    mockCreate.mockResolvedValue({ id: 1, createdAt: new Date(), updatedAt: new Date(), deletedAt: null });
    mockCount.mockResolvedValue(42);

    const app = buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/ping',
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({ count: 42 });
  });

  it('returns 500 with error message when database throws', async () => {
    mockCreate.mockRejectedValue(new Error('Connection refused'));

    const app = buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/ping',
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toHaveProperty('error', 'Connection refused');
  });
});
