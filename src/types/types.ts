export interface UserParams {
    id: string;
};

export interface UpdateUserBody {
    username: string;
};

export interface GetPrivateChatParams {
    userId1: string;
    userId2: string;
}

export interface SendChatBody {
    senderId: string;
    text: string;
}

export interface SendPrivateChatBody extends SendChatBody {
    receiverId: string;
}

export interface SendGroupChatBody extends SendChatBody {
    groupId: string;
}

export interface GroupParams {
    groupId: string;
}

export interface GetGroupChatParams extends GroupParams {
    userId: string;
}

export interface CreateGroupBody {
    name: string;
    memberIds: string[];
}

export interface AddGroupMemberBody {
    memberIds: string[];
};