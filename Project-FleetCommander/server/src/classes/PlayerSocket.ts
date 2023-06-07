
import * as Delta from '../../../shared/src/classes/GameDelta';

// TODO: Garbage collect this?? Probably on the deletion of a game room? Really need a better way to do that...

/**
 * Wrapper for SocketIO.Socket adding 'game' and 'player' identification. Also initialized the socket event handlers
 */
export class PlayerSocket {

    public socket: SocketIO.Socket;
    public game: string;
    public player: string;

    constructor(
        socket: SocketIO.Socket,
        addPlayerToLobby: (socket: SocketIO.Socket, game: string) => string,
        sendMessage: (game: string, message: string) => void,
        readyUp: (socket: SocketIO.Socket, game: string, playerId: string) => void,
        submitPlayerActions: (socket: SocketIO.Socket, data: Delta.FromClientDelta, game: string, playerId: string) => void,
        removePlayerFromGame: (socket: SocketIO.Socket, game: string, player: string) => void,
        cleanup: (socket: SocketIO.Socket) => void
    ) {
        this.socket = socket;
        this.game = "";
        this.player = "";
        
        this.setupSocket(
            addPlayerToLobby,
            sendMessage,
            readyUp,
            submitPlayerActions,
            removePlayerFromGame,
            cleanup
        );
    }

    private setupSocket(
        addPlayerToLobby: (socket: SocketIO.Socket, game: string) => string,
        sendMessage: (game: string, message: string) => void,
        readyUp: (socket: SocketIO.Socket, game: string, playerId: string) => void,
        submitPlayerActions: (socket: SocketIO.Socket, data: Delta.FromClientDelta, game: string, playerId: string) => void,
        removePlayerFromGame: (socket: SocketIO.Socket, game: string, player: string) => void,
        cleanup: (socket: SocketIO.Socket) => void
    ): void {
        this.socket.on('joinLobby', (game: string) => {
            if (game) {
                this.game = game;
                this.player = addPlayerToLobby(this.socket, this.game);
            }
        });
    
        this.socket.on('chat', (message: string) => {
            if (this.game) {
                sendMessage(this.game, `${this.player}-${message}`);
            }
            else {
                this.socket.emit('chat', message);
            }
        });
    
        this.socket.on('ready', () => {
            if (this.socket && this.game && this.player) {
                readyUp(this.socket, this.game, this.player);
            }
        });
    
        this.socket.on('submitActions', (data: Delta.FromClientDelta) => {
            if (this.socket && this.game && this.player) {
                submitPlayerActions(this.socket, data, this.game, this.player);
            }
        });
    
        this.socket.on('leaveGame', () => {
            if (this.socket && this.game && this.player) {
                removePlayerFromGame(this.socket, this.game, this.player);
                this.game = "";
            }

            this.game = "";
        });
    
    
        this.socket.on('disconnect', () => {
            if (this.game) {
                removePlayerFromGame(this.socket, this.game, this.player);
                cleanup(this.socket);
                this.game = "";
            }
            console.log('user disconnected');
        });
    }

}






