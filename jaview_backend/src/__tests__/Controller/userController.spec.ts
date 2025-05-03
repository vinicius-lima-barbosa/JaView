// ✅ MOCKS DEVEM VIR ANTES DOS IMPORTS REAIS
jest.mock('../../models/usersModel', () => ({
  User: {}
}));
jest.mock('../../models/moviesModel', () => ({
  Movie: {}
}));
jest.mock('../../lib/client.supabase', () => ({
  clientS3: { send: jest.fn() }
}));
jest.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid'
}));

import {
  createUserController,
  loginUserController,
  getUserReviewsController,
  getUserProfileController,
  updateUserProfileController,
  getUserByUsernameController,
  uploadUserAvatarContoller
} from '../../controller/userController';

import * as userService from '../../services/userService';
import { clientS3 } from '../../lib/client.supabase';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();
  res.json = jest.fn();
  return res;
};

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createUserController - deve retornar 201 com token', async () => {
    const req = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: '123456',
        confirmedPassword: '123456'
      }
    } as any;
    const res = mockRes();

    jest.spyOn(userService, 'createUserService').mockResolvedValue({
      token: 'jwt.token',
      message: 'User created!'
    });

    await createUserController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      token: 'jwt.token',
      message: 'User created!'
    });
  });

  it('loginUserController - deve retornar 200 com token', async () => {
    const req = { body: { email: 'test@mail.com', password: '123456' } } as any;
    const res = mockRes();

    jest.spyOn(userService, 'loginUserService').mockResolvedValue({
      token: 'jwt.token',
      message: 'Login success'
    });

    await loginUserController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      token: 'jwt.token',
      message: 'Login success'
    });
  });

  it('getUserReviewsController - deve retornar 200 com reviews', async () => {
    const req = { userId: 'user123' } as any;
    const res = mockRes();

    jest.spyOn(userService, 'getUserReviewsService').mockResolvedValue([
      {
        movie_id: 'm1',
        review: 'bom',
        rating: 5,
        created_at: new Date()
      }
    ] as any); // <- evita erros com DocumentArray

    await getUserReviewsController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      reviews: expect.any(Array)
    });
  });

  it('getUserProfileController - deve retornar 200 com dados', async () => {
    const req = { userId: 'user123' } as any;
    const res = mockRes();

    jest.spyOn(userService, 'getUserProfileService').mockResolvedValue({
      name: 'Fulano',
      email: 'fulano@email.com',
      bio: 'bio',
      avatar_url: ''
    });

    await getUserProfileController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      name: 'Fulano',
      email: 'fulano@email.com',
      bio: 'bio',
      avatar_url: ''
    });
  });

  it('updateUserProfileController - deve retornar 200 com novo perfil', async () => {
    const req = {
      userId: 'user123',
      body: { name: 'Novo', bio: 'Nova bio' }
    } as any;
    const res = mockRes();

    jest.spyOn(userService, 'updateUserProfileService').mockResolvedValue({
      name: 'Novo',
      email: 'novo@email.com'
    });

    await updateUserProfileController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      name: 'Novo',
      email: 'novo@email.com'
    });
  });

  it('getUserByUsernameController - deve retornar 200 com lista', async () => {
    const req = { query: { username: 'fulano' } } as any;
    const res = mockRes();

    jest.spyOn(userService, 'getUserByUsernameService').mockResolvedValue([
      {
        name: 'Fulano',
        email: 'f@f.com',
        password: 'fake',
        role: 'user',
        reviews: [] as any,
        bio: '',
        avatar_url: ''
      }
    ] as any);

    await getUserByUsernameController(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      users: expect.any(Array)
    });
  });

  describe('uploadUserAvatarContoller', () => {
    it('deve enviar novo avatar sem avatar anterior', async () => {
      const req = {
        userId: 'user123',
        file: {
          buffer: Buffer.from('fake'),
          mimetype: 'image/png'
        }
      } as any;
      const res = mockRes();

      jest.spyOn(userService, 'getUserProfileService').mockResolvedValue({
        name: 'User',
        email: 'user@email.com',
        bio: 'bio',
        avatar_url: ''
      });

      jest.spyOn(userService, 'updateUserAvatarService').mockResolvedValue({
        name: 'User',
        email: 'user@email.com',
        avatar_url: 'https://fakeurl/avatar/mocked-uuid'
      });

      await uploadUserAvatarContoller(req, res);

      expect(clientS3.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        avatar_url: 'https://fakeurl/avatar/mocked-uuid'
      });
    });

    it('deve deletar avatar antigo e enviar novo', async () => {
      const req = {
        userId: 'user123',
        file: {
          buffer: Buffer.from('fake'),
          mimetype: 'image/png'
        }
      } as any;
      const res = mockRes();

      jest.spyOn(userService, 'getUserProfileService').mockResolvedValue({
        name: 'User',
        email: 'user@email.com',
        bio: 'bio',
        avatar_url:
          'https://ucaxwlukyjnbjufoplzq.supabase.co/storage/v1/object/public/avatar/old.png'
      });

      jest.spyOn(userService, 'updateUserAvatarService').mockResolvedValue({
        name: 'User',
        email: 'user@email.com',
        avatar_url: 'https://fakeurl/avatar/mocked-uuid'
      });

      await uploadUserAvatarContoller(req, res);

      expect(clientS3.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
      expect(clientS3.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar 400 se o arquivo não for enviado', async () => {
      const req = { userId: 'user123' } as any;
      const res = mockRes();

      await uploadUserAvatarContoller(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing file' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      const req = {
        userId: 'user123',
        file: {
          buffer: Buffer.from('x'),
          mimetype: 'image/png'
        }
      } as any;
      const res = mockRes();

      jest
        .spyOn(userService, 'getUserProfileService')
        .mockRejectedValue(new Error('Erro'));

      await uploadUserAvatarContoller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro' });
    });
  });
});
