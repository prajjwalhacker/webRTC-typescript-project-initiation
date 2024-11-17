import { Socket } from 'socket.io';

import { roomManager } from './roomManager';

export interface User {
    name: string;
    socket: Socket;
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private rooms: roomManager[];

    constructor(){
        this.users = [];
        this.queue = [];
        this.rooms = [];
    }

    addUser (name: string, socket: Socket) {
         this.users.push({
            name,
            socket
         })
         this.queue.push(socket.id);
         this.clearQueue();
    }
    clearQueue () { 
        if (this.queue.length < 2) return;

        const user1 = this.users.find((item) => item.socket.id === this.queue.pop());
        const user2 = this.users.find((item) => item.socket.id === this.queue.pop());

    }
}