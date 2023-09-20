
import { Server, Socket } from 'socket.io';
import * as Events from '../../../shared/src/classes/SocketEvents.js';

export type GameServer = Server<Events.ClientToServerEvents, Events.ServerToClientEvents, Events.InterServerEvents, Events.SocketData>;
export type PlayerSocket = Socket<Events.ClientToServerEvents, Events.ServerToClientEvents, Events.InterServerEvents, Events.SocketData>;


//TODO: Maybe eventually move all the implementation and socket initialization stuff into here to clean up server.ts