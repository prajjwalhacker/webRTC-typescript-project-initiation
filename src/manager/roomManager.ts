import { User } from "./UserManager";


interface room {
    user1: User;
    user2: User;
    roomId: number;
}


let GLOBAL_ROOM_ID = 0;

export class roomManager {
    private room: room[];
    private roomId: number;
    constructor() {
        this.room = [];
        this.roomId = GLOBAL_ROOM_ID;
    }

    createRoom(user1: User, user2: User) {
       this.generateRoomId();
       this.room.push({
        user1, 
        user2, 
        roomId: this.roomId
       })
    }

    generateRoomId() {
       this.roomId = this.roomId+1;
    }

}