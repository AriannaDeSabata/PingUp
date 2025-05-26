import messageModel from "../models/MessageModel.js"
import chatModel from "../models/ChatModel.js"


const setUpSocket =  (io) => {
    //evento che si attiva quando il client si connette
  io.on('connection', (socket) => {
    console.log('🟢 Client connesso:', socket.id)

    //evento che si attiva quando il client chiude la pagina, si disconnette, aggiorna il browser
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnesso:', socket.id)
    })

    //il serer riceve i dati dal client tramite evento chat:message
    socket.on('chat:message', async (data) => {
      console.log('📨 Messaggio:', data)

      const {chatId, senderId, text} = data

      try {
        //creo il messaggio
        const newMessage = new messageModel({
            chat: chatId,
            sender: senderId,
            text: text
        })
        //salvo il messaggio
        const saveMessage = await newMessage.save()

        //collego l'id del messaggio nella chat 
        await chatModel.findByIdAndUpdate(chatId, {
             $push: { messages: saveMessage._id }
        })

        await saveMessage.populate('sender', 'name surname avatar')

        //emetto il messaggio in tempo reale 
        io.to(chatId).emit('chat:message', saveMessage)


      } catch (error) {
        console.log(error)
      }

    })
  })
}

export default setUpSocket