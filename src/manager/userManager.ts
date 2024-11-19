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
         socket.emit('lobby');
         this.initHandler(socket);
         this.clearQueue();
    }
    clearQueue () { 

        if (this.queue.length < 2) return;

        const id1 = this.queue.pop();
        const id2 = this.queue.pop();

        const user1 = this.users.find((item) => item.socket.id === id1);
        const user2 = this.users.find((item) => item.socket.id === id2);

        if (!user1 || !user2) return;
        this.roomManager.createRoom(user1, user2);
        this.clearQueue();
        
    }
    removeUser (id: string) {
      this.users = (this.users || []).filter((item) => item?.socket?.id !== id);
      this.queue = (this.queue || []).filter((item) => item !== id);
    }  
    initHandler (socket: Socket) {
        socket.on('offer', ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            console.log(sdp, roomId,"sdp and roomId");
            this.roomManager.onOffer(roomId, sdp);
        })
        socket.on('answer',({ sdp, roomId }: { sdp: string, roomId: string }) => {
            console.log(sdp, roomId, "sdp and answer");
            this.roomManager.onAnswer(roomId, sdp);
        })
    }
    removeRoom(socketId: string) {
        const userToPushInQueue = this.roomManager.removeRoom(socketId);

        this.queue.push(userToPushInQueue.socket.id);
        userToPushInQueue.socket.emit('person-quit');
        this.clearQueue();
    }
}