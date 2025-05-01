// MOCKS DEVEM VIR ANTES DOS IMPORTS
jest.mock('../src/services/movieService');

import { Request, Response } from 'express';
import {
  addReviewController,
  removeReviewController,
  getMovieReviewsController
} from '../src/controller/movieController';
import * as movieService from '../src/services/movieService';

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();
  return res;
};

describe('movieController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addReviewController', () => {
    it('deve chamar addReviewService e retornar 201 com resultado', async () => {
      const req = {
        params: { movieId: 'm1' },
        body: { review: 'ótimo', rating: 5 },
        userId: 'u1'
      } as unknown as Request;
      const res = mockRes();

      const fakeResult = { message: 'Review added successfully!', movie: {} };
      jest
        .spyOn(movieService, 'addReviewService')
        .mockResolvedValue(fakeResult as any);

      await addReviewController(req, res);

      expect(movieService.addReviewService).toHaveBeenCalledWith(
        'u1',
        'm1',
        'ótimo',
        5
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(fakeResult);
    });

    it('deve retornar 500 se ocorrer erro no service', async () => {
      const req = {
        params: { movieId: 'm1' },
        body: { review: 'ótimo', rating: 5 },
        userId: 'u1'
      } as unknown as Request;
      const res = mockRes();

      jest
        .spyOn(movieService, 'addReviewService')
        .mockRejectedValue(new Error('fail'));

      await addReviewController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: 'An error occurred while deleting the review! fail'
      });
    });
  });

  describe('removeReviewController', () => {
    it('deve chamar removeReviewService e retornar 200', async () => {
      const req = {
        params: { movieId: 'm1', reviewId: 'r1' },
        userId: 'u1'
      } as unknown as Request;
      const res = mockRes();

      jest.spyOn(movieService, 'removeReviewService').mockResolvedValue(undefined);

      await removeReviewController(req, res);

      expect(movieService.removeReviewService).toHaveBeenCalledWith(
        'm1',
        'r1',
        'u1'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Review deleted successfully!'
      });
    });

    it('deve retornar 500 se ocorrer erro no service', async () => {
      const req = {
        params: { movieId: 'm1', reviewId: 'r1' },
        userId: 'u1'
      } as unknown as Request;
      const res = mockRes();

      jest
        .spyOn(movieService, 'removeReviewService')
        .mockRejectedValue(new Error('fail remove'));

      await removeReviewController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: 'An error occurred while deleting the review! fail remove'
      });
    });
  });

  describe('getMovieReviewsController', () => {
    it('deve chamar getMovieReviewsService e retornar 200 com reviews', async () => {
      const req = {
        params: { movieId: 'm1' }
      } as unknown as Request;
      const res = mockRes();

      const fakeReviews = [{ review: 'bom', rating: 4 }] as any;
      jest
        .spyOn(movieService, 'getMovieReviewsService')
        .mockResolvedValue(fakeReviews);

      await getMovieReviewsController(req, res);

      expect(movieService.getMovieReviewsService).toHaveBeenCalledWith('m1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ reviews: fakeReviews });
    });

    it('deve retornar 500 se ocorrer erro no service', async () => {
      const req = {
        params: { movieId: 'm1' }
      } as unknown as Request;
      const res = mockRes();

      jest
        .spyOn(movieService, 'getMovieReviewsService')
        .mockRejectedValue(new Error('fail fetch'));

      await getMovieReviewsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Error while fetching reviews! fail fetch'
      });
    });
  });
});
