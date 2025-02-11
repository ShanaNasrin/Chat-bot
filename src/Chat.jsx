import  { useState } from 'react';
import { OpenAI } from 'openai';
import './Chat.css'


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

   
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true, 
  });

  const handleSend = async () => {
     if (inputValue.trim()) {
      // Add the user's message to the list
      setMessages([...messages, { text: inputValue, sender: 'user' }]);

      
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', 
          messages: [
            {
              role: 'user',
              content: inputValue,
            },
          ],
        });
        const chatGPTResponse = response.choices[0].message.content;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: chatGPTResponse, sender: 'chatgpt' },
        ]);
      } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'chatgpt' },
        ]);
      }

      setInputValue(''); 
    }
  };

   const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend(); 
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'chatgpt-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="Type message here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};


export default Chat;