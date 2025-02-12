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

## Order Process:
1. **Order Request**: Ask the customer what product they want to order
     and provide available product list
2. **Product Inquiry**: Show the relevant product info, including:
   - Image
   - Price per meter
   - Available colors
3. **Specific Requirements**: Ask for size, quantity, or customizations.
4. **Order Placement**: Proceed with order once they provide details.
5. **Payment**: Request payment method.
6. **Order Confirmation**: Provide an order ID and thank you message.
7. **Ready-Made Products**: Ask for color, size, and quantity for ready-made items.

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

## Material Information:
    ### Cotton
    - **Image**: ![Cotton Material](https://cdn.pixabay.com/photo/2019/06/22/11/15/folded-4291376_1280.jpg)  
    - **Price per meter**: €12.99
    - **Available Colors**: White, Blue, Green, Red

    ### Linen
    - **Image**: ![Linen Material](https://cdn.pixabay.com/photo/2016/10/17/13/46/fabric-1747649_1280.jpg)  
    - **Price per meter**: €15.49
    - **Available Colors**: Beige, Light Blue, Pink

    ### Silk
    - **Image**: ![Silk Material](https://cdn.pixabay.com/photo/2015/07/14/17/49/silk-845134_1280.jpg)  
    - **Price per meter**: €29.99
    - **Available Colors**: Gold, Silver, Ivory

    ### Chiffon
    - **Image**: ![Chiffon](https://cdn.pixabay.com/photo/2015/10/16/09/41/the-substance-990769_1280.jpg)  
    - **Price per meter**: €8.99
    - **Available Colors**: Black, Grey, White, Navy


## Order Management:
- For **order inquiries**: Ask the customer for their **order ID** and **order date** to provide updates.
- After placing the order, ask for payment method and confirm the order. Provide the **order ID** and a **thank you message**.



if the user ask about location or place of the shop located send them this link https://maps.app.goo.gl/Fg6q87vZcpMDF5Tx8

if user ask date, time, month, year answer it simply


Remember: Keep interactions simple, friendly, and focused on helping customers find what they need.` }, 
  ]);

  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true, 
  });

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
     if (!trimmedInput) {
        alert('Please enter a message.');
      return;
    }
      const userMessage = { role: 'user', content: trimmedInput };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      
    try {

         let chatGPTResponse = '';
         const locationKeywords = /(location|address)/i;
         

        if (locationKeywords.test(trimmedInput)) {
          chatGPTResponse = "Here is the location of our shop: https://maps.app.goo.gl/Fg6q87vZcpMDF5Tx8";
        } else {
           const productRegex = /(cotton|linen|silk|chiffon)/i;
           const productMatch = trimmedInput.match(productRegex);

        if (productMatch) {
          const productName = productMatch[0].toLowerCase();
          const product = {
            cotton: {
              image: 'https://cdn.pixabay.com/photo/2019/06/22/11/15/folded-4291376_1280.jpg',
              name: 'Cotton',
              price: '€12.99',
              colors: ['White', 'Blue', 'Green', 'Red'],
            },
            linen: {
              image: 'https://cdn.pixabay.com/photo/2016/10/17/13/46/fabric-1747649_1280.jpg',
              name: 'Linen',
              price: '€15.49',
              colors: ['Beige', 'Light Blue', 'Pink'],
            },
            silk: { 
              image: 'https://cdn.pixabay.com/photo/2015/07/14/17/49/silk-845134_1280.jpg',
              name: 'Silk',
              price: '€29.99',
              colors: ['Gold', 'Silver', 'Ivory'],
            },
            chiffon: {
              image: 'https://cdn.pixabay.com/photo/2015/10/16/09/41/the-substance-990769_1280.jpg',
              name: 'Chiffon',
              price: '€8.99',
              colors: ['Black', 'Grey', 'White', 'Navy'],
            },
          }[productName];

          if (product) {
            chatGPTResponse = `${product.name}:`;
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: 'assistant', content: chatGPTResponse, type: 'product', product },
            ]);
          }
        } else {
        
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', 
            messages: [...messages, userMessage], 
        });


         chatGPTResponse = response.choices[0].message.content;

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: chatGPTResponse },
        ]);
    }
} 
      } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
        ]);
      }finally{

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
      {message.type === 'product' ? (
                <div>
                  <p>{message.content}</p>
                  <img src={message.product.image} alt={message.product.name} className="product-image" />
                  <p>Price: {message.product.price}</p>
                  <p>Available Colors: {message.product.colors.join(', ')}</p>
                </div>
              
       ) : message.content.includes("https://maps.app.goo.gl/") ? (
          <div>
            <p>Here is the location of our shop</p>
            <a href={message.content.split(' ')[7]} target="_blank" rel="noopener noreferrer">
              Click here to view the shop location on Google Maps
            </a>
          </div>
        )  : (
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