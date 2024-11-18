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
       user1.socket.emit('send-offer',{
         roomId
       })
    }
    generateRoomId() {
       return GLOBAL_ROOM_ID++;
    }

}