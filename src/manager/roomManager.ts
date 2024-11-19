import { User } from "./UserManager";


interface room {
    user1: User;
    user2: User;
    roomId: string;
}


let GLOBAL_ROOM_ID = 1;

export class roomManager {
    private room: Map<string, room>;
    constructor() {
        this.room = new Map<string, room>();
    }
    onOffer(roomId: string, sdp: string) {
       const user = this.room.get(roomId?.toString())?.user2;
       user?.socket.emit('offer-with-sdp', { roomId,  sdp });
    }
    onAnswer(roomId: string, sdp: string) {
        const user = this.room.get(roomId?.toString())?.user1;
        user?.socket.emit('answer-with-sdp', { roomId, sdp });
    }
    createRoom(user1: User, user2: User) {
       const roomId = this.generateRoomId();
       this.room.set(roomId.toString(),{
        user1,
        user2,
        roomId: roomId.toString()
       })
       console.log(user1, "user1");
       user1.socket.emit('send-offer',{
         roomId
       })
    }
    generateRoomId() {
       return GLOBAL_ROOM_ID++;
    }
    removeRoom(socketId: string) {
        let requiredKey = '';
        let userToPushInQueue: any = {}; 
        for (const [key, value] of this.room.entries()) {
           if (value.user1.socket.id === socketId) {
              requiredKey = key;
              userToPushInQueue = value.user2;
           }
           if (value.user2.socket.id === socketId) {
              requiredKey = key;
              userToPushInQueue.user2;
           }
        }
        this.room.delete(requiredKey);

        return userToPushInQueue; 
    }
    onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver") {
        const roomElemet = this.room.get(roomId);
        if (!roomElemet) {
            return;
        }
        const receivingUser = roomElemet.user1.socket.id === senderSocketid ? roomElemet.user2: roomElemet.user1;
        receivingUser.socket.emit("add-ice-candidate", ({candidate, type}));
    }

}