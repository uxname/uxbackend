const log = require('../helper/logger').getLogger('messenger_resolver');
const prisma = require('../helper/prisma_helper').prisma;
const GQLError = require('../helper/GQLError');

async function createConversation(root, {data}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const userId = ctx.user.id;

    const {title, participants, conversationType} = data;

    const participantsTmpArr = [];
    if (participants.length > 0) {
        participants.forEach(item => {
            participantsTmpArr.push({
                id: item
            })
        })
    }

    const usersWhoBlockedMe = await prisma.blockLists({
        where: {
            AND: {
                user: {id_in: participants},
                blockedUser: {id: userId}
            }
        }
    });

    if (usersWhoBlockedMe.length > 0) {
        const idList = [];
        usersWhoBlockedMe.forEach(item => {
            idList.push({
                id: item.id
            })
        });

        throw new GQLError({message: 'You blocked by users', code: 403, data: {userIdList: idList}});
    }

    const existsConversations = await prisma.conversations({
        where: {
            AND: {
                participants_some: {id: participants[0]},
                conversationType: "SINGLE"
            }
        }
    });

    if (existsConversations.length > 0) {
        return existsConversations[0];
    } else {
        return await prisma.createConversation({
            title: title,
            conversationType: conversationType,
            creator: {connect: {id: userId}},
            participants: {
                connect: participantsTmpArr
            }
        });
    }
}

async function sendMessage(root, {data}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const userId = ctx.user.id;

    const {conversationId, messageType, message, attachmentUrl} = data;

    const conversation = await prisma.conversation({id: conversationId});
    const participants = await prisma.conversation({id: conversationId}).participants();

    if (conversation.conversationType === "SINGLE" && participants.length > 0) {
        const participantsTmpArr = [];
        participants.forEach(item => {
            participantsTmpArr.push(item.id);
        });

        const usersWhoBlockedMe = await prisma.blockLists({
            where: {
                AND: {
                    user: {id_in: participantsTmpArr},
                    blockedUser: {id: userId}
                }
            }
        });

        if (usersWhoBlockedMe.length > 0) {
            const idList = [];
            usersWhoBlockedMe.forEach(item => {
                idList.push({
                    id: item.id
                })
            });

            throw new GQLError({message: 'You blocked by users', code: 403, data: {userIdList: idList}});
        }
    }


    return await prisma.createMessage({
        conversation: {connect: {id: conversationId}},
        message: message,
        sender: {connect: {id: userId}},
        attachmentUrl: attachmentUrl,
        messageType: messageType
    })
}

async function deleteMessage(root, {messageId}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const userId = ctx.user.id;

    const sender = await prisma.message({id: messageId}).sender();

    if (sender.id === userId) {
        return await prisma.updateMessage({where: {id: messageId}, data: {isDeleted: true}});
    } else {
        throw new GQLError({message: 'You are not sender', code: 403});
    }
}

async function blockUser(root, {userId}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const myId = ctx.user.id;

    const exists = await prisma.$exists.blockList({user: {id: myId}, blockedUser: {id: userId}});
    if (exists) {
        return await prisma.user({id: userId});
    } else {
        return await prisma.createBlockList({
            user: {connect: {id: myId}},
            blockedUser: {connect: {id: userId}}
        }).blockedUser()
    }
}

async function unblockUser(root, {userId}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const myId = ctx.user.id;

    const blockLists = await prisma.blockLists({where: {user: {id: myId}, blockedUser: {id: userId}}});
    const exists = blockLists.length > 0;

    if (exists) {
        await prisma.deleteBlockList({
            id: blockLists[0].id
        }).blockedUser();
    }

    return await prisma.user({id: userId});
}

module.exports = {
    createConversation: createConversation,
    sendMessage: sendMessage,
    deleteMessage: deleteMessage,
    blockUser: blockUser,
    unblockUser: unblockUser,
};
