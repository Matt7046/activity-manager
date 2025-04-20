// socketSingleton.ts
import Socket from "./Socket";
import { UserI } from "./Utils";

class SocketFamilyPoint extends Socket {

  private constructor(user: UserI, url: string) {
    super(user, url);
    console.log("WebSocket inizializzato per SocketNotification");
  }
}

export default SocketFamilyPoint;

