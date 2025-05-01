import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../src/middleware/authMiddleware';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let mockReq: Partial<Request> & { userId?: string };
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('deve permitir acesso com token válido', () => {
    const decodedToken = { id: 'user123', iat: 123456, exp: 123999 };
    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

    mockReq.headers = {
      authorization: 'Bearer validtoken'
    };

    authMiddleware(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', expect.any(String));
    expect(mockReq.userId).toBe('user123');
    expect(mockNext).toHaveBeenCalled();
  });

  it('deve retornar 401 se o token não for fornecido', () => {
    authMiddleware(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "",
      error: expect.any(jwt.TokenExpiredError)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar 500 se o token for inválido', () => {
    mockReq.headers = {
      authorization: 'Bearer invalidtoken'
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid token',
      error: expect.any(Error)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token estiver expirado', () => {
    mockReq.headers = {
      authorization: 'Bearer expiredtoken'
    };

    const expiredError = new jwt.TokenExpiredError('', new Date());
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw expiredError;
    });

    authMiddleware(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "",
      error: expiredError
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
