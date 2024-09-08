import React, { useState } from 'react';
import axios from 'axios';

const MessageForm = () => {
    const [senderId, setSenderId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/messages', { senderId, receiverId, text });
            alert('Message sent successfully');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Sender ID:</label>
                <input type="text" value={senderId} onChange={(e) => setSenderId(e.target.value)} />
            </div>
            <div>
                <label>Receiver ID:</label>
                <input type="text" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} />
            </div>
            <div>
                <label>Message:</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageForm;
