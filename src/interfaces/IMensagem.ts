import { IChat } from './IChat';
import { IUsuario } from './IUsuario';

export interface IMensagem {
    _id: string;
    mensagem: string;
    data: Date | string;
    chat: string | IChat;
    usuario: IUsuario | string | null;
}
