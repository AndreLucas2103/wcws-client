import { IChat } from 'interfaces/IChat';
import { SET_CHAT } from '../../types/chatTypes';

const INITIAL_STATE: IChat | null = null;

type ChatReduxActionType = { type: typeof SET_CHAT; payload: IChat };

export function ChatReducer(state = INITIAL_STATE, action: ChatReduxActionType) {
    switch (action.type) {
        case SET_CHAT:
            return action.payload;

        default:
            return state;
    }
}
