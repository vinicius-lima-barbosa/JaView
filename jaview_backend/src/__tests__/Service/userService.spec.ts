import {
  createUserService,
  loginUserService,
  getUserReviewsService,
  getUserProfileService,
  updateUserProfileService,
  updateUserAvatarService,
  getUserByUsernameService
} from '../../services/userService';
import { User } from '../../models/usersModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mockSave = jest.fn();

// Mock do model User com métodos estáticos e construtor
jest.mock('../../models/usersModel', () => {
  return {
    User: Object.assign(
      jest.fn().mockImplementation(() => ({
        save: mockSave,
        _id: '123',
        email: 'email@example.com',
        name: 'Fulano',
        reviews: [],
        password: 'hashed-password',
      })),
      {
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        find: jest.fn()
      }
    )
  };
});

// Mock do bcrypt e jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('createUserService', () => {
  const mockToken = 'fake-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar usuário com dados válidos e retornar token', async () => {
    // mocka que nome e email não existem
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // name
      .mockResolvedValueOnce(null); // email

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await createUserService(
      'Fulano',
      'email@example.com',
      'senha123',
      'senha123'
    );

    expect(result).toEqual({
      token: mockToken,
      message: 'User created!'
    });

    expect(mockSave).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: '123', email: 'email@example.com' },
      expect.any(String),
      { expiresIn: '1d' }
    );

  });

  it('deve lançar erro se os dados forem inválidos', async () => {
    await expect(
      createUserService('Fulano', 'email', '123', '456') // email inválido, senhas diferentes
    ).rejects.toThrow();
  });

  it('deve lançar erro se nome já existir', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({}); // nome já existe

    await expect(
      createUserService('Fulano', 'novoemail@example.com', 'senha123', 'senha123')
    ).rejects.toThrow('Name already exists');
  });

  it('deve lançar erro se email já existir', async () => {
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // nome não existe
      .mockResolvedValueOnce({}); // email já existe

    await expect(
      createUserService('NovoNome', 'email@example.com', 'senha123', 'senha123')
    ).rejects.toThrow('User already exists!');
  });
});

describe('loginUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer login com email e senha válidos', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: '123',
      password: 'hashed-password'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake-token');

    const result = await loginUserService('email@example.com', 'senha123');

    expect(result).toEqual({
      token: 'fake-token',
      message: 'Successful Login!'
    });
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      loginUserService('naoexiste@example.com', 'senha')
    ).rejects.toThrow('User not found!');
  });

  it('deve lançar erro se a senha estiver incorreta', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: '123',
      password: 'hashed-password'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUserService('email@example.com', 'senhaErrada')
    ).rejects.toThrow('Invalid credentials!');
  });
});

describe('getUserReviewsService', () => {
  it('deve retornar as reviews do usuário', async () => {
    const fakeUser = { reviews: [{ movie_id: '1', review: 'bom d maiz', rating: 5 }] };
    (User.findById as jest.Mock).mockResolvedValue(fakeUser);

    const result = await getUserReviewsService('123');

    expect(result).toEqual(fakeUser.reviews);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(getUserReviewsService('123')).rejects.toThrow('User not found');
  });
});

describe('getUserProfileService', () => {
  it('deve retornar o perfil do usuário (sem senha)', async () => {
    const fakeUser = {
      name: 'Fulano',
      email: 'email@example.com',
      bio: 'Bio legal',
      avatar_url: 'url-da-imagem'
    };
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser)
    });

    const result = await getUserProfileService('123');

    expect(result).toEqual(fakeUser);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(getUserProfileService('123')).rejects.toThrow('User not found');
  });
});

describe('updateUserProfileService', () => {
  it('deve atualizar nome e bio e retornar novo perfil', async () => {
    const updatedUser = {
      name: 'NovoNome',
      email: 'email@example.com'
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(updatedUser)
    });

    const result = await updateUserProfileService('123', 'NovoNome', 'Nova bio');

    expect(result).toEqual(updatedUser);
  });

  it('deve lançar erro se nome já existir', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({});

    await expect(
      updateUserProfileService('123', 'Fulano', 'Nova bio')
    ).rejects.toThrow('Name already exists');
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(
      updateUserProfileService('123', 'NovoNome', 'Bio')
    ).rejects.toThrow('User not found');
  });
});

describe('updateUserAvatarService', () => {
  it('deve atualizar o avatar e retornar os dados', async () => {
    const updatedUser = {
      name: 'Fulano',
      email: 'email@example.com',
      avatar_url: 'nova_url'
    };

    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(updatedUser)
    });

    const result = await updateUserAvatarService('123', 'nova_url');

    expect(result).toEqual(updatedUser);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(
      updateUserAvatarService('123', 'url')
    ).rejects.toThrow('User not found');
  });
});

describe('getUserByUsernameService', () => {
  it('deve retornar usuários com nome semelhante (sem senha)', async () => {
    const fakeUsers = [{ name: 'Fulano', email: 'fulano@email.com' }];
    (User.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUsers)
    });

    const result = await getUserByUsernameService('fulano');

    expect(result).toEqual(fakeUsers);
  });

  it('deve lançar erro se nenhum usuário for encontrado', async () => {
    (User.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await expect(getUserByUsernameService('alguem')).rejects.toThrow('User not found');
  });
});