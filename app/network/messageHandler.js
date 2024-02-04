class MessageHandler {
    handleMessage(data) {
      // Handle received messages
      console.log('Message received:', data);
    }
  
    sendMessage(peerConnection, data) {
      // Send a message to a peer using p2p
      peerConnection.conn.send(data);
      console.log('Message sent:', data);
    }
  }
  
export default MessageHandler;