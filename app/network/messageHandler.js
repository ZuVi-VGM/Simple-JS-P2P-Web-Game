class MessageHandler {
    handleMessage(data) {
      // Implementa la logica per gestire i messaggi ricevuti
      console.log('Messaggio ricevuto:', data);
    }
  
    sendMessage(peerConnection, data) {
      // Invia un messaggio a un peer tramite la connessione P2P
      peerConnection.conn.send(data);
      console.log('Messaggio inviato:', data);
    }
  }
  
  export default MessageHandler;