import { combineReducers } from 'redux';
import { LoadingReducer } from './Loading.reducer';
import { ChatReducer } from './Chat.reducer';

const reducer = combineReducers({
    loading: LoadingReducer,
    chat: ChatReducer,
});

export default reducer;
