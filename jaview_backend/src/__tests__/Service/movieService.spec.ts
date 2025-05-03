import {
  addReviewService,
  removeReviewService,
  getMovieReviewsService
} from '../../services/movieService';

import { Movie } from '../../models/moviesModel';
import { User } from '../../models/usersModel';

const mockSaveMovie = jest.fn();

jest.mock('../../models/moviesModel', () => {
  return {
    Movie: Object.assign(
      jest.fn().mockImplementation((data) => ({
        ...data,
        reviews: [],
        save: mockSaveMovie
      })),
      {
        findById: jest.fn()
      }
    )
  };
});

jest.mock('../../models/usersModel', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('addReviewService', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve adicionar uma nova review ao filme e ao usuário', async () => {
    mockSaveMovie.mockResolvedValue({
      reviews: [
        {
          _id: 'review123',
          user_id: 'user123',
          review: 'ótimo',
          rating: 5,
          created_at: new Date('2025-01-01T00:00:00Z')
        }
      ]
    });

    (Movie.findById as jest.Mock).mockResolvedValue(null);

    const mockSaveUser = jest.fn();
    const userMock = {
      reviews: [],
      save: mockSaveUser
    };

    (User.findById as jest.Mock).mockResolvedValue(userMock);

    const result = await addReviewService('user123', 'movie123', 'ótimo', 5);

    expect(result).toMatchObject({
      message: 'Review added successfully!',
      movie: {
        reviews: [
          {
            user_id: 'user123',
            review: 'ótimo',
            rating: 5
          }
        ]
      }
    });

    const createdAt = result.movie.reviews[0].created_at;
    expect(new Date(createdAt)).toEqual(new Date('2025-01-01T00:00:00Z'));

    expect(mockSaveMovie).toHaveBeenCalled();
    expect(mockSaveUser).toHaveBeenCalled();
  });

  it('deve lançar erro se o usuário já tiver feito review do filme', async () => {
    const existingReview = {
      _id: 'r1',
      user_id: 'user123',
      review: 'bom',
      rating: 4,
      created_at: new Date()
    };

    const movieMock = {
      reviews: [existingReview],
      save: jest.fn()
    };

    (Movie.findById as jest.Mock).mockResolvedValue(movieMock);

    await expect(
      addReviewService('user123', 'movie123', 'novo', 5)
    ).rejects.toThrow('You have already reviewed this movie.');
  });
});

describe('removeReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve remover a review do filme e do usuário', async () => {
    const mockSaveMovie = jest.fn();
    const mockSaveUser = jest.fn();

    const movieMock = {
      reviews: [
        { _id: 'review123', user_id: 'user123', review: 'legal', rating: 4 }
      ],
      save: mockSaveMovie
    };

    const userMock = {
      reviews: [
        { _id: 'review123', movie_id: 'movie123', review: 'legal', rating: 4 }
      ],
      save: mockSaveUser
    };

    (Movie.findById as jest.Mock).mockResolvedValue(movieMock);
    (User.findById as jest.Mock).mockResolvedValue(userMock);

    await removeReviewService('movie123', 'review123', 'user123');

    expect(movieMock.reviews.length).toBe(0);
    expect(userMock.reviews.length).toBe(0);
    expect(mockSaveMovie).toHaveBeenCalled();
    expect(mockSaveUser).toHaveBeenCalled();
  });

  it('deve lançar erro se o filme não for encontrado', async () => {
    (Movie.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      removeReviewService('movie123', 'review123', 'user123')
    ).rejects.toThrow('Movie not found');
  });

  it('deve lançar erro se review não for encontrada no filme', async () => {
    const movieMock = {
      reviews: [],
      save: jest.fn()
    };

    (Movie.findById as jest.Mock).mockResolvedValue(movieMock);

    await expect(
      removeReviewService('movie123', 'review123', 'user123')
    ).rejects.toThrow('Review not found for this movie');
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    const movieMock = {
      reviews: [{ _id: 'review123', user_id: 'user123', review: 'legal', rating: 4 }],
      save: jest.fn()
    };

    (Movie.findById as jest.Mock).mockResolvedValue(movieMock);
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      removeReviewService('movie123', 'review123', 'user123')
    ).rejects.toThrow('User not found');
  });

  it('deve lançar erro se review não for encontrada no perfil do usuário', async () => {
    const movieMock = {
      reviews: [{ _id: 'review123', user_id: 'user123', review: 'legal', rating: 4 }],
      save: jest.fn()
    };

    const userMock = {
      reviews: [],
      save: jest.fn()
    };

    (Movie.findById as jest.Mock).mockResolvedValue(movieMock);
    (User.findById as jest.Mock).mockResolvedValue(userMock);

    await expect(
      removeReviewService('movie123', 'review123', 'user123')
    ).rejects.toThrow('Review not found in user profile');
  });
});

describe('getMovieReviewsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar as reviews populadas do filme', async () => {
    const movieMock = {
      reviews: [
        { user_id: { name: 'Fulano' }, review: 'muito bom', rating: 5 }
      ]
    };

    const populateMock = jest.fn().mockResolvedValue(movieMock);

    (Movie.findById as jest.Mock).mockReturnValue({
      populate: populateMock
    });

    const result = await getMovieReviewsService('movie123');

    expect(result).toEqual(movieMock.reviews);
    expect(populateMock).toHaveBeenCalledWith({
      path: 'reviews.user_id',
      select: 'name'
    });
  });

  it('deve retornar lista vazia se o filme não for encontrado', async () => {
    const populateMock = jest.fn().mockResolvedValue(null);

    (Movie.findById as jest.Mock).mockReturnValue({
      populate: populateMock
    });

    const result = await getMovieReviewsService('movie123');

    expect(result).toEqual([]);
  });
});
