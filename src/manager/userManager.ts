import { Socket } from 'socket.io';

import { roomManager } from './roomManager';

export interface User {
    name: string;
    socket: Socket;
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private roomManager: roomManager;

    constructor(){
        this.users = [];
        this.queue = [];
        this.roomManager = new roomManager();
    }

    addUser (name: string, socket: Socket) {
         this.users.push({
            name,
            socket
         })
         this.queue.push(socket.id);
         this.initHandler(socket);
         this.clearQueue();
    }
    clearQueue () { 
        if (this.queue.length < 2) return;
        const user1 = this.users.find((item) => item.socket.id === this.queue.pop());
        const user2 = this.users.find((item) => item.socket.id === this.queue.pop());
        if (!user1 || !user2) return;
        this.roomManager.createRoom(user1, user2);
        this.clearQueue();
        
    }
    removeUser (user: User) {
      this.users = this.users.filter((item) => item.socket.id !== user.socket.id);
      this.queue = this.queue.filter((item) => item !== user.socket.id);
    }
    initHandler (socket: Socket) {
        socket.on('offer', ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onOffer(sdp, roomId);
        })
        socket.on('answer',({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onAnswer(sdp, roomId);
        })
    }

}