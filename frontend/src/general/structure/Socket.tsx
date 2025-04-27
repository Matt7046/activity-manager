// socketSingleton.ts
import { UserI } from "./Utils";

class Socket {
  private static instance: Socket | null = null;
  private webSocket: WebSocket;

  public constructor(user: UserI, url: string) {
    console.log("WebSocket inizializzato per", user?.emailUserCurrent);
    this.webSocket = new WebSocket(url);
  }

  static getInstance(user: UserI, url: string): Socket {
     if (!Socket.instance) {
      Socket.instance = new Socket(user, url);
    }
    return Socket.instance;


  }

  getSocket(): WebSocket {
    return this.webSocket;
  }

  static async resetInstance(): Promise<void> {
    if (Socket.instance) {
      const socket = Socket.instance.webSocket;

      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        await new Promise<void>((resolve) => {
          socket.onclose = () => {
            console.log("WebSocket chiuso");
            resolve();
          };
          socket.close();
        });
      }
      Socket.instance = null;
    }
  }

  // 💥 Metodo per fare il reconnect pulito
  static async reconnect(user: UserI, url: string): Promise<Socket> {
    console.log("Riconnessione WebSocket...");
    await Socket.resetInstance();
    return Socket.getInstance(user, url);
  }
}
export default Socket;
