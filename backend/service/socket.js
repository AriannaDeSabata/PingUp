import messageModel from "../models/MessageModel.js"
import chatModel from "../models/ChatModel.js"


const setUpSocket =  (io) => {
    //connessione
  io.on('connection', (socket) => {
    console.log('🟢 Client connesso:', socket.id)

    //  Aggiunta alla chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId)
      console.log(`📥 Utente ${socket.id} è entrato nella stanza ${chatId}`)

    })

     // Disconnect
        socket.on('disconnect', () => {
          console.log('🔴 Client disconnesso:', socket.id)
        })


    socket.on('send_message', async (data) => {
      const {chatId, senderId, text} = data

      try {
        const newMessage = new messageModel({
            chat: chatId,
            sender: senderId,
            text: text
        })

        const saveMessage = await newMessage.save()
        await chatModel.findByIdAndUpdate(chatId, {
             $push: { messages: saveMessage._id }
        })

        const populatedMessage = await saveMessage.populate('sender', 'name surname avatar')

        io.to(chatId).emit('send_message', populatedMessage)


      } catch (error) {
        console.log(error)
      }

    })
  })
}

export default setUpSocket