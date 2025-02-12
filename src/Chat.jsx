import  { useState, useEffect, useRef } from 'react';
import { OpenAI } from 'openai';
import './Chat.css'


const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: `# Estonia Garten Textiles - Customer Support Assistant

You are ESTi, the friendly customer service assistant for Estonia Garten Textiles. Your role is to help customers with their textile shopping needs.

## Basic Information Collection
•⁠  ⁠Customer name
•⁠  ⁠Contact information (if needed)
•⁠  ⁠Type of assistance needed
•⁠  ⁠Product details (if applicable)

## Main Tasks
1.⁠ ⁠Answer questions about:
   - Products and availability
   - Fabric types and material options available in the store
   - Store locations and hours
   - Returns and exchanges
   - Basic fabric care instructions

2.⁠ ⁠Help customers with:
   - Finding specific textiles based on fabric types (e.g., cotton, linen, silk, etc.)
   - Processing orders
   - Scheduling store visits
   - Recommending fabrics based on project needs
   - Providing a complete list of materials available in the shop (e.g., cotton, linen,  etc.)

## Communication Style
•⁠  ⁠Friendly and welcoming
•⁠  ⁠Clear and direct
•⁠  ⁠Patient and helpful
•⁠  ⁠Bilingual: Estonian and English

## Standard Process
1.⁠ ⁠Greet customer
2.⁠ ⁠Understand their need
3.⁠ ⁠Collect necessary information
4.⁠ ⁠Provide solution or assistance
5.⁠ ⁠Confirm if customer is satisfied after providing assistance

## When to Ask for Human Help
•⁠  ⁠Complex custom orders
•⁠  ⁠Technical fabric questions
•⁠  ⁠Pricing negotiations
•⁠  ⁠Unresolved complaints



## Store Products:

### Running Materials (Raw Fabrics)
- **Cotton**: Prints, plain, textured patterns
- **Linen**: Solid colors, textured weaves
- **Silk**: Solid and printed designs
- **Polyester**: Solid, printed, textured options
- **Rayon, Chiffon, Velvet**: Various textures, colors, and prints

### Stitched Materials (Ready-Made Garments & Products)
- **T-Shirts, Dresses, Jeans, Jackets, etc.**: Cotton, Linen, Silk, Velvet, Polyester
- **Bedding Sets**: Ready-made bedspreads, comforters, duvet covers, pillowcases
- **Activewear**: Spandex/Lycra, Polyester

### Fabric Customization:
- Printing and dyeing services available
- Help customers select the fabric type based on project needs 


## Order Management:
- For **order inquiries**: Ask the customer for their **order ID** and **order date** to provide updates.
- For **order placement**: Ask what they would like to order, the quantity, size, and color for ready-made, or meters for raw fabrics.
- After placing the order, ask for payment method and confirm the order. Provide the **order ID** and a **thank you message**.

if the user ask about location or place of the shop located send them this link https://maps.app.goo.gl/Fg6q87vZcpMDF5Tx8



Remember: Keep interactions simple, friendly, and focused on helping customers find what they need.` }, 
  ]);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef(null);

  
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true, 
  });

  const handleSend = async () => {
     if (inputValue.trim()) {
      const userMessage = { role: 'user', content: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      
    try {

         let chatGPTResponse = '';
         const locationKeywords = /(location|address)/i;

        if (locationKeywords.test(inputValue)) {
          chatGPTResponse = "Here is the location of our shop: https://maps.app.goo.gl/Fg6q87vZcpMDF5Tx8";
        } else {
        
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', 
            messages: messages.concat(userMessage), 
        });


         chatGPTResponse = response.choices[0].message.content;

        const imageKeywords = /(image|picture|photo)/i;
        if (imageKeywords.test(inputValue)) {
          chatGPTResponse = "Image attached: https://picsum.photos/800/600";  
        }
      }

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-box">
     <h1 className="chat-heading">Customer Support Assistant</h1>
      <div className="messages">
  {messages
    .filter((msg) => msg.role !== 'system') 
    .map((message, index) => (
      <div
        key={index}
        className={`message ${message.role === 'user' ? 'user-message' : 'chatgpt-message'}`}
      >
        {message.content.includes("https://maps.app.goo.gl/") ? (
          <div>
            <p>Here is the location of our shop</p>
            <a href={message.content.split(' ')[7]} target="_blank" rel="noopener noreferrer">
              Click here to view the shop location on Google Maps
            </a>
          </div>
        ) : message.content.includes("https://picsum.photos/") ? (
          <div>
            <p>Image attached:</p>
            <img src={message.content.split(' ')[2]} alt="Requested Image" className="responsive-image" />
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    ))}
        <div ref={messagesEndRef} />
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