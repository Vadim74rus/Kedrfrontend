import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageList = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/messages/${receiverId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchMessages();
    }, [receiverId]);

    return (
        <div>
            <h2>Messages for {receiverId}</h2>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.sender.name}:</strong> {msg.text} ({new Date(msg.timestamp).toLocaleString()})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
