import { Request, Response } from 'express';
import * as friendshipService from '../../services/friendshipService';
import {
  sendFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController,
  removeFriendController,
  listFriendsController,
  listFriendsRequestsController,
  listFriendsRequestsSentController
} from '../../controller/friendshipController';

jest.mock('../../services/friendshipService');

const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  req.userId = '';
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('friendshipController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendFriendRequestController deve retornar sucesso', async () => {
    const req = mockRequest();
    req.body.friendId = '456';
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.sendFriendRequestService as jest.Mock).mockResolvedValue({ id: 'req1' });

    await sendFriendRequestController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Friend request sent successfully',
      friendship: { id: 'req1' }
    });
  });

  it('acceptFriendRequestController deve retornar sucesso', async () => {
    const req = mockRequest();
    req.params.friendshipId = 'fid';
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.acceptFriendRequestService as jest.Mock).mockResolvedValue({ id: 'accepted' });

    await acceptFriendRequestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Friend request accepted successfully',
      friendship: { id: 'accepted' }
    });
  });

  it('rejectFriendRequestController deve retornar sucesso', async () => {
    const req = mockRequest();
    req.params.friendshipId = 'fid';
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.rejectFriendRequestService as jest.Mock).mockResolvedValue({ id: 'rejected' });

    await rejectFriendRequestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Friend request rejected successfully',
      friendship: { id: 'rejected' }
    });
  });

  it('removeFriendController deve retornar sucesso', async () => {
    const req = mockRequest();
    req.params.friendshipId = 'fid';
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.removeFriendRequestService as jest.Mock).mockResolvedValue({ message: 'Friend removed successfully' });

    await removeFriendController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'Friend removed successfully' });
  });

  it('listFriendsController deve retornar lista de amigos', async () => {
    const req = mockRequest();
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.listFriendsService as jest.Mock).mockResolvedValue(['friend1', 'friend2']);

    await listFriendsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      friendships: ['friend1', 'friend2'],
      userId: '123'
    });
  });

  it('listFriendsRequestsController deve retornar solicitações recebidas', async () => {
    const req = mockRequest();
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.listFriendsRequestsService as jest.Mock).mockResolvedValue(['request1']);

    await listFriendsRequestsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ friendships: ['request1'] });
  });

  it('listFriendsRequestsSentController deve retornar solicitações enviadas', async () => {
    const req = mockRequest();
    req.userId = '123';

    const res = mockResponse();
    (friendshipService.listFriendsRequestsSentService as jest.Mock).mockResolvedValue(['sent1']);

    await listFriendsRequestsSentController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ friendships: ['sent1'] });
  });
});
