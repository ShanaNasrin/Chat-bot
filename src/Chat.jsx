import { useState, useEffect, useRef } from "react";
import { OpenAI } from "openai";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `# Estonia Garten Textiles - Customer Support Assistant

You are ESTi, the friendly customer service assistant for Estonia Garten Textiles. Your role is to help customers with their textile shopping needs.

 Basic Information Collection
•⁠  ⁠Customer name
•⁠  ⁠Contact information (if needed)
•⁠  ⁠Type of assistance needed
•⁠  ⁠Product details (if applicable)

 Main Tasks
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

 Communication Style
•⁠  ⁠Friendly and welcoming
•⁠  ⁠Clear and direct
•⁠  ⁠Patient and helpful
•⁠  ⁠Bilingual: Estonian and English

 Standard Process
1.⁠ ⁠Greet customer
2.⁠ ⁠Understand their need
3.⁠ ⁠Collect necessary information
4.⁠ ⁠Provide solution or assistance
5.⁠ ⁠Confirm if customer is satisfied after providing assistance

 When to Ask for Human Help
•⁠  ⁠Complex custom orders
•⁠  ⁠Technical fabric questions
•⁠  ⁠Pricing negotiations
•⁠  ⁠Unresolved complaints

 Order Process:
1. Order Request: Ask the customer what product they want to order
     and provide available product list
2. Product Inquiry: Show the relevant product info, including:
   - Image
   - Price per meter
   - Available colors
3. Specific Requirements: Ask for size, quantity, or customizations.
4. Order Placement: Proceed with order once they provide details.
5. Delivery Adderss: ask their address where to deliver the product.
6. Payment: Request payment method.
7. Order Confirmation: Provide an order ID and thank you message.
8. Ready-Made Products: Ask for color, size, and quantity for ready-made items.


 Product Categories:
- Running Materials (Raw Fabrics)
- Stitched Materials (Ready-Made Garments & Products)
- Fabric Customization

 Available Products:

while listing the products you must include image of the product

 Running Materials (Raw Fabrics)
1. Cotton
    - Image: ![Cotton Material](https://cdn.pixabay.com/photo/2019/06/22/11/15/folded-4291376_1280.jpg)  
    - Price per meter
    - Available Colors
2. Linen
    - Image: ![Linen Material](https://cdn.pixabay.com/photo/2016/10/17/13/46/fabric-1747649_1280.jpg)  
    - Price per meter
    - Available Colors
3. Silk
    - Image: ![Silk Material](hhttps://cdn.pixabay.com/photo/2020/03/09/16/02/silk-4916174_1280.jpg)  
    - Price per meter
    - Available Colors
4. Polyester
    - Image: ![Polyester](https://cdn.pixabay.com/photo/2017/08/05/01/11/fabric-2581994_1280.jpg)  
    - Price per meter
    - Available Colors
5. Rayon
    - Image: ![Rayon](https://cdn.pixabay.com/photo/2016/11/14/17/56/textile-1824172_1280.jpg)  
    - Price per meter
    - Available Colors
6. Chiffon
    - Image: ![Chiffon](https://cdn.pixabay.com/photo/2015/10/16/09/41/the-substance-990769_1280.jpg)  
    - Price per meter
    - Available Colors
7. Velvet
    - Image: ![Velvet Material](https://cdn.pixabay.com/photo/2016/10/17/13/51/navy-blue-1747663_1280.jpg)  
    - Price per meter
    - Available Colors
7. Denim
    - Image: ![Denim Material](https://cdn.pixabay.com/photo/2019/10/01/10/43/jeans-4517866_1280.jpg)  
    - Price per meter
    - Available Colors    

 Stitched Materials (Ready-Made Garments & Products)
- T-Shirts, Dresses, Jeans, Jackets, etc.: Cotton, Linen, Silk, Velvet, Polyester
- Bedding Sets: Ready-made bedspreads, comforters, duvet covers, pillowcases
- Activewear: Spandex/Lycra, Polyester

 Fabric Customization:
- Printing and dyeing services available
- Help customers select the fabric type based on project needs 

 Order Management:
- For order inquiries: Ask the customer for their order ID and order date to provide updates.
- After placing the order, ask for payment method and confirm the order. Provide the order ID and a thank you message.



if the user ask about location or place of the shop located send them this link https://maps.app.goo.gl/Fg6q87vZcpMDF5Tx8

When user ask for the date, time, year, or month, provide the current date and time.

Remember: Keep interactions simple, friendly, and focused on helping customers find what they need.`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const messagesEndRef = useRef(null);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage = { role: "user", content: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

   

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages.concat(userMessage),
        });

        const chatGPTResponse = response.choices[0].message.content;

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: chatGPTResponse },
        ]);
      } catch (error) {
        console.error("Error calling ChatGPT API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      }

      setInputValue("");
    }
  };

  function extractLink(str) {
    const regex = /(https?:\/\/[^\s]+)/g;
    const links = str.match(regex);

    const filteredLinks = [];

    if (links === null) {
      return [];
    }

    for (let i = 0; i < links.length; i++) {
      let fixedLink = links[i].replace(")", "");
      filteredLinks.push(fixedLink);
    }

    return filteredLinks;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <h1 className="chat-heading">Customer Support Assistant</h1>
      <div className="messages">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((message, index) => {
            const hasLink = message.content.includes("https://");
            let imageLinks = extractLink(message.content);
            console.log(imageLinks);

            // Convert URLs in text to clickable links
            const renderMessageWithLinks = (text) => {
              return text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
                part.match(/https?:\/\/[^\s]+/) ? (
                  <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "underline" }}
                  >
                    {part}
                  </a>
                ) : (
                  part
                )
              );
            };

            return (
              <div
                key={index}
                className={`message ${
                  message.role === "user" ? "user-message" : "chatgpt-message"
                }`}
              >
                <p>{renderMessageWithLinks(message.content)}</p>

                {message.role === "assistant" &&
                  hasLink === true &&
                  (imageLinks.length <= 3 ? (
                    //  If less than 3  images, display them normally (no grid)
                    imageLinks.map((imageLink, index) => (
                      <div key={index}>
                        <img
                          src={imageLink}
                          alt="image"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "2px",
                            // objectFit: "cover",
                            // marginRight: "5px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    //  If more than 3 images, display in a 2x2 grid
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "5px",
                        maxWidth: "310px",
                      }}
                    >
                      {imageLinks.slice(0, 3).map((imageLink, index) => (
                        <img
                          key={index}
                          src={imageLink}
                          alt="image"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "2px",
                            objectFit: "cover",
                          }}
                          onClick={() => {
                            setSelectedImages(imageLinks);
                            setModalOpen(true);
                          }}
                        />
                      ))}

                      {/* 4th image with +X overlay */}
                      <div
                        style={{
                          position: "relative",
                          width: "150px",
                          height: "150px",
                          borderRadius: "2px",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `url(${imageLinks[3]}) center/cover no-repeat`,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          onClick={() => {
                            setSelectedImages(imageLinks);
                            setModalOpen(true);
                          }}
                        ></div>
                        <span
                          style={{
                            position: "absolute",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                          
                        >
                          +{imageLinks.length - 3}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Image Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <div
              className="image-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "10px",
                padding: "10px",
              }}
            >
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Full View"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};






export default Chat;
