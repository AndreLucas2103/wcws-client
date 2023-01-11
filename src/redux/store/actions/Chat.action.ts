import { IChat } from 'interfaces/IChat';
import { SET_CHAT } from '../../types/chatTypes';

export function setChat(data: IChat) {
    return {
        type: SET_CHAT,
        payload: data,
    };
}
