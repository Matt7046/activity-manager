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
    if (user === undefined || user === null) {
      Socket.instance?.webSocket?.close();
    }
    if (!Socket.instance) {
      Socket.instance = new Socket(user, url);
    }
    return Socket.instance;


  }

  getSocket(): WebSocket {
    return this.webSocket;
  }

  static resetInstance(): void {
    // utile se vuoi forzare la chiusura e ricreazione (es: logout)
    if (Socket.instance?.webSocket.readyState === WebSocket.OPEN) {
      Socket.instance.webSocket.close();
    }
    Socket.instance = null;
  }
}

export default Socket;
