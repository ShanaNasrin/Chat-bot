import  { useState } from 'react';
import { OpenAI } from 'openai';
import './Chat.css'


const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }, 
  ]);
  const [inputValue, setInputValue] = useState('');

   
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true, 
  });

  const handleSend = async () => {
     if (inputValue.trim()) {
      const userMessage = { role: 'user', content: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      
      try {
        
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', 
          messages: messages.concat(userMessage), 
        });


        const chatGPTResponse = response.choices[0].message.content;


        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: chatGPTResponse },
        ]);
      } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
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
        {messages
          .filter((msg) => msg.role !== 'system') 
          .map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'chatgpt-message'}`}
            >
            {message.content}
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