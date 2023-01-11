import { useAppDispatch, useAppSelector } from '@/utils/hooks/useRedux';
import { socket } from '@/utils/providers/SocketIoProvider';
import { ISocketResponse } from 'interfaces/ISocketResponse';
import { IChat } from 'interfaces/IChat';
import { useEffect, useRef, useState } from 'react';
import { setChat } from 'redux/store/actions/Chat.action';
import parse from 'html-react-parser';
import { IMensagem } from 'interfaces/IMensagem';
import { dateString } from 'components/text/formatoDate';
import { IUsuario } from 'interfaces/IUsuario';

export const Chat = () => {
    const chat = useAppSelector((state) => state.chat);

    const dispatch = useAppDispatch();

    useEffect(() => {
        socket.on('usuario_aceitar_chat', (data: ISocketResponse<{ chat: IChat }>) => {
            console.log(data);
            dispatch(setChat(data.data.chat));
        });

        return () => {
            socket.off('usuario_aceitar_chat');
        };
    }, [chat]);

    if (!chat) return null;

    return (
        <div className="text-padrao font-normal text-normal bg-[#f1f1f1] h-screen">
            {chat.situacao === 1 ? <AguardandoAtendimento /> : <ChatAtendimento />}
        </div>
    );
};

const AguardandoAtendimento = () => {
    return (
        <section className="h-full flex items-center justify-center w-full">
            <div className=" bg-orange-200 p-20px rounded-[14px]">Aguarde enquanto um atendente se conecta a você.</div>
        </section>
    );
};

const formatMensagem = (mensagem: string) => {
    function linkify() {
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;
        return mensagem.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank" className="hover:text-blue-400 underline " >' + url + '</a>';
        });
    }

    return parse(linkify());
};

const ChatAtendimento = () => {
    const dispatch = useAppDispatch();

    const chat = useAppSelector((state) => state.chat);

    const [mensagem, setMensagem] = useState('');

    const [mensagens, setMensagens] = useState<IMensagem[]>([]);

    const scrollMensagemNova = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on('nova_mensagem', (data: ISocketResponse<{ mensagem: IMensagem }>) => {
            const {
                data: { mensagem },
            } = data;

            setMensagens((oldMsg) => [
                ...oldMsg,
                {
                    _id: mensagem._id,
                    chat: mensagem.chat,
                    data: mensagem.data,
                    mensagem: mensagem.mensagem,
                    usuario: mensagem.usuario,
                },
            ]);
        });

        if (scrollMensagemNova.current) {
            scrollMensagemNova.current.scrollIntoView();
        }

        return () => {
            socket.off('nova_mensagem');
        };
    }, [mensagens, chat]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commentEnterSubmit = (e: any) => {
        // enviar o text usando o enter
        if (e.key === 'Enter' && e.shiftKey == false) {
            e.preventDefault();
            return enviarMensagem();
        }
    };

    const ButtonNovoAtendimento = () => {
        return <button onClick={() => {}}>Novo Atendimento</button>;
    };

    const enviarMensagem = () => {
        // enviar mensagem para o socket
        if (mensagem.length > 0) {
            socket.emit('nova_mensagem', {
                idChat: chat?._id,
                mensagem: mensagem,
            });

            setMensagem('');
        }
    };

    const msgGroup: {
        hora: string | Date;
        usuario: IUsuario | null;
        mensagens: IMensagem[];
    }[] = [];

    mensagens.forEach((msg, i) => {
        if (typeof msg.usuario === 'string') return;

        const hora = dateString(msg.data, { format: 'HH:mm' });

        const mensagemAnterior = mensagens[i - 1];

        if (mensagemAnterior) {
            if (typeof mensagemAnterior.usuario === 'string') return;

            if (
                mensagemAnterior.usuario?._id === msg.usuario?._id &&
                dateString(mensagemAnterior.data, { format: 'HH:mm' }) === hora
            ) {
                msgGroup[msgGroup.length - 1].mensagens.push(msg);
            } else {
                msgGroup.push({
                    hora,
                    mensagens: [msg],
                    usuario: msg.usuario,
                });
            }
        } else {
            msgGroup.push({
                hora,
                mensagens: [msg],
                usuario: msg.usuario,
            });
        }
    });

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="min-h-[80px] flex items-center px-20px border-b">
                <p className="text-16px font-bold">
                    Atendimento Online -{' '}
                    {chat?.usuarioResponsavel.map((usuario, index) => (
                        <span key={index}>{typeof usuario === 'string' ? null : usuario.primeiroNome}</span>
                    ))}
                    {chat?.situacao === 3 && <ButtonNovoAtendimento />}
                </p>
            </div>
            <div className="flex flex-col space-y-[6px] overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch p-30px w-full">
                {msgGroup.map((mensagem, index) => {
                    if (!mensagem.usuario)
                        return (
                            <div className="flex items-end justify-end" key={index}>
                                <div className="flex flex-col space-y-2 text-12px max-w-[60%] mx-2 order-1 items-end">
                                    {mensagem.mensagens.map((msg, index) => (
                                        <div key={msg._id}>
                                            <span className="px-4 py-2 rounded-[8px] inline-block bg-slate-600 text-white ">
                                                <p className="whitespace-pre-wrap">{formatMensagem(msg.mensagem)}</p>
                                            </span>

                                            {index === mensagem.mensagens.length - 1 && (
                                                <p className="text-10px text-medium font-normal mt-[4px] text-end">
                                                    {mensagem.hora.toString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                    if (typeof mensagem.usuario === 'string') return null;
                    else {
                        return (
                            <div className="flex items-end" key={index}>
                                <div className="flex flex-col space-y-2 text-12px max-w-[60%] mx-2 order-2 items-start">
                                    {mensagem.mensagens.map((msg, index) => (
                                        <div key={msg._id}>
                                            <span className="px-4 py-2 rounded-[8px] inline-block bg-gray-300 text-gray-600">
                                                <p className="font-bold">
                                                    {index === 0 && mensagem.usuario?.primeiroNome}
                                                </p>
                                                <p className="whitespace-pre-wrap">{formatMensagem(msg.mensagem)}</p>
                                            </span>
                                            {index === mensagem.mensagens.length - 1 && (
                                                <p className="text-10px text-medium font-normal mt-[4px]">
                                                    {mensagem.hora.toString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <img
                                    src={mensagem.usuario.foto}
                                    alt="My profile"
                                    className="w-[30px] h-[30px] rounded-full order-1 mb-[18px]"
                                />
                            </div>
                        );
                    }
                })}
                <div ref={scrollMensagemNova} />
            </div>
            <div className="min-h-[80px] flex px-20px pt-10px border-t">
                <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={commentEnterSubmit}
                    className="w-full h-[60px] border-2 border-gray-300 rounded-lg focus:ring-0 focus:border text-padrao"
                    disabled={chat?.situacao === 3 ? true : false}
                />
                <button
                    type="button"
                    className="bg-blue-500 h-[60px] p-[10px] rounded-lg mx-10px text-white"
                    onClick={enviarMensagem}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};
