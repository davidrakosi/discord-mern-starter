import React from 'react'
import './Chat.css'
import ChatHeader from './ChatHeader'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CradGiftcardIcon from '@material-ui/icons/CardGiftcard'
import GifIcon from '@material-ui/icons/Gif'
import EmojiEmoticonsIcon from '@material-ui/icons/EmojiEmotions'
import Message from './Message'
import { useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import { selectChannelId, selectChannelName } from './features/appSlice'
import { useState } from 'react'
import { useEffect } from 'react'
import db from './firebase'
import firebase from 'firebase'

const Chat = () => {
    const user = useSelector(selectUser)
    const channelId = useSelector(selectChannelId)
    const channelName = useSelector(selectChannelName)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (channelId) {
            db.collection('channels').doc(channelId).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            })
        }


    }, [channelId])

    const sendMessage = (e) => {
        e.preventDefault()

        db.collection('channels').doc(channelId).collection('messages').add({
            message: input,
            user: user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setInput('')
    }

    return (
        <div className='chat' >
            <ChatHeader channelName={channelName} />

            <div className="chat__messages">
                {messages.map((message) => {
                    console.log(message)
                })}
                {messages.map(message => (
                    <Message message={message.message} timestamp={message.timestamp} user={message.user} />
                ))}
            </div>

            <div className="chat__input">
                <AddCircleIcon fontSize='large' />
                <form>
                    <input type="text" disabled={!channelId} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message #${channelName}`} />
                    <button className='chat__inputButton' onClick={sendMessage} disabled={!channelId} type='submit'>Send Message</button>
                </form>

                <div className="chat__inputIcon">
                    <CradGiftcardIcon fontSize='large' />
                    <GifIcon fontSize='large' />
                    <EmojiEmoticonsIcon fontSize='large' />
                </div>
            </div>
        </div>
    )
}

export default Chat
