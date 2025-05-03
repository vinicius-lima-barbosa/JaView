import {
    sendFriendRequestService,
    acceptFriendRequestService,
    rejectFriendRequestService,
    removeFriendRequestService,
    listFriendsService,
    listFriendsRequestsService,
    listFriendsRequestsSentService
} from '../../services/friendshipService';

import { Friendship } from '../../models/friendshipModel';

jest.mock('../../models/friendshipModel');

const mockFriendship = {
    findOne: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
    find: jest.fn()
};

(Friendship as any).findOne = mockFriendship.findOne;
(Friendship as any).findById = mockFriendship.findById;
(Friendship as any).deleteOne = mockFriendship.deleteOne;
(Friendship as any).find = mockFriendship.find;

describe('Friendship Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('sendFriendRequestService - deve lançar erro ao tentar adicionar a si mesmo', async () => {
        await expect(sendFriendRequestService('123', '123')).rejects.toThrow(
            'You can´t add yourself as a friend'
        );
    });

    it('sendFriendRequestService - deve lançar erro se já houver uma solicitação existente', async () => {
        mockFriendship.findOne.mockResolvedValue({ _id: 'abc' });

        await expect(sendFriendRequestService('1', '2')).rejects.toThrow(
            'Friend request already sent'
        );
    });

    it('sendFriendRequestService - deve criar uma nova solicitação se não existir', async () => {
        mockFriendship.findOne.mockResolvedValue(null);
        const saveMock = jest.fn();
        (Friendship as any).mockImplementation(() => ({
            save: saveMock,
        }));

        await sendFriendRequestService('1', '2');
        expect(saveMock).toHaveBeenCalled();
    });



    it('acceptFriendRequestService - deve aceitar a solicitação se for o destinatário', async () => {
        const save = jest.fn();
        mockFriendship.findById.mockResolvedValue({
            friend_id: { equals: (id: string) => id === '2' },
            status: 'pending',
            save,
        });

        const result = await acceptFriendRequestService('fid123', '2');
        expect(result.status).toMatch("accepted"); // status será atualizado dentro do save()
        expect(save).toHaveBeenCalled();
    });

    it('acceptFriendRequestService - deve lançar erro se o usuário não for o destinatário', async () => {
        mockFriendship.findById.mockResolvedValue({
            friend_id: { equals: () => false }
        });

        await expect(
            acceptFriendRequestService('fid123', 'unauthorized')
        ).rejects.toThrow('You are not authorized to accept this friend request');
    });



    it('rejectFriendRequestService - deve rejeitar a solicitação', async () => {
        const save = jest.fn();
        mockFriendship.findById.mockResolvedValue({
            friend_id: { equals: (id: string) => id === '2' },
            save,
        });

        const result = await rejectFriendRequestService('fid123', '2');
        expect(save).toHaveBeenCalled();
        expect(result.status).toBe('rejected');
    });


    describe('removeFriendRequestService', () => {
        it('deve remover amizade se o usuário for um dos envolvidos', async () => {
            mockFriendship.findById.mockResolvedValue({
                user_id: { equals: (id: string) => id === '2' },
                friend_id: { equals: () => false }
            });

            mockFriendship.deleteOne.mockResolvedValue({});

            const result = await removeFriendRequestService('fid123', '2');
            expect(mockFriendship.deleteOne).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Friend removed successfully' });
        });

        it('deve lançar erro se o usuário não for participante', async () => {
            mockFriendship.findById.mockResolvedValue({
                user_id: { equals: () => false },
                friend_id: { equals: () => false }
            });

            await expect(
                removeFriendRequestService('fid123', 'nao_autorizado')
            ).rejects.toThrow('You are not authorized to remove this friend');
        });
    });

    describe('listFriendsService', () => {
        it('deve retornar lista de amizades', async () => {
            mockFriendship.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(['friend1', 'friend2'])
                })
            });

            const result = await listFriendsService('user123');
            expect(result).toEqual(['friend1', 'friend2']);
        });
    });

    describe('listFriendsRequestsService', () => {
        it('deve retornar lista de solicitações recebidas', async () => {
            mockFriendship.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(['req1', 'req2'])
            });

            const result = await listFriendsRequestsService('user123');
            expect(result).toEqual(['req1', 'req2']);
        });
    });

    describe('listFriendsRequestsSentService', () => {
        it('deve retornar lista de solicitações enviadas', async () => {
            mockFriendship.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(['sent1'])
            });

            const result = await listFriendsRequestsSentService('user123');
            expect(result).toEqual(['sent1']);
        });
    });
});
