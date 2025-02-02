import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft,FaUpload, FaArrowRight, FaWhatsapp, FaCalendarAlt, FaComment, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import loading from "../assets/img/load.jpg";
import Domain from "../Constans/Domain";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {getId,getToken} from "../Helper/Tokens";
const LoadingIcon = () => (
  <div
    className="loader flex justify-center items-center h-screen"
    style={{ paddingBottom: "150px" }}
  >
    <img src={loading} className="w-16 h-16" alt="Loading..." />
  </div>
);
const doctorsEndpoint = `${Domain.resoureseUrl()}/api/Specialization/get-all-docs`;

const Doctors = () => {
  const slider = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDoctor, setChatDoctor] = useState(null);
  const [recipientId,setRecipientId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(doctorsEndpoint,);
        
        // console.log(response.data);
        if (!response.status === 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setDoctors(data.data);
        
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const settings = {
    accessibility: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };


  const handleChatClick = (doctorId) => {
    setIsChatOpen(true);
    setChatDoctor(doctors.find((doc) => doc.id === doctorId));
    setRecipientId(doctorId);
  };

  if (isLoading) {
    return <LoadingIcon/>
  }

  if (error) {
    return <div>An error occurred while loading data: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-16 ">
      <div className="flex flex-col items-center justify-between mb-10 lg:mb-0">
        <div>
          <h1 className="text-4xl font-semibold text-center lg:text-center">Our Doctors</h1>
        </div>
        <div className="flex gap-5 mt-4 lg:mt-4">
          <button
            className="bg-[#d5f2ec] text-blue-400 px-4 py-2 rounded-lg active:bg-[#ade9dc]"
            onClick={() => slider.current.slickPrev()}
          >
            <FaArrowLeft size={25} />
          </button>
          <button
            className="bg-[#d5f2ec] text-blue-400 px-4 py-2 rounded-lg active:bg-[#ade9dc]"
            onClick={() => slider.current.slickNext()}
          >
            <FaArrowRight size={25} />
          </button>
        </div>
      </div>
      <div className="mt-5">
        <Slider ref={slider} {...settings}>
          {doctors.map((doctor, index) => (
            <div
              className="h-[350px] text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2 cursor-pointer relative
              transition-transform duration-300 ease-in-out transform hover:scale-105"
              key={index}
            >
              <div>
                <img
                  src={`../assets/img/doc${doctor.id}.jpg`}                
                  alt="img"
                  className="h-56 rounded-t-xl w-full"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-semibold text-xl pt-4">Dr: {doctor.name}</h1>
                <h3 className="pt-2"></h3>
                <div className="flex gap-4 mt-3 absolute bottom-4 right-4">
                  <a
                    href={`whatsapp://send?phone=+1234567890&text=Hello%20Dr.%20${doctor.name},%20I'd%20like%20to%20schedule%20an%20appointment.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={20} className="text-red-500" />
                  </a>
                  

                   <a onClick={() => navigate(`/appointment/${doctor.id}`)}> 
                      <FaCalendarAlt size={20} className="text-blue-500" />
                  </a>
                      

                  <button onClick={() => handleChatClick(doctor.id)}>
                    <FaComment size={20} className="text-blue-500 cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {/* <div style={{margin:"300px"}}>
       <a href="/appointment" target="_blank" rel="noopener noreferrer">
                    <FaCalendarAlt size={20} className="text-blue-500" />
                  </a>
    </div> */}
      {isChatOpen && <ChatModal doctor={chatDoctor} recipientId={recipientId} onClose={() => setIsChatOpen(false)} />}
     
    </div>
 
    
  );
};

// ////////////////////////////////////////////
const ChatModal = ({ doctor, onClose, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`https://gp-backend-api.onrender.com/api/Chat/history?sen=${getId(getToken("access"))}&reci=${recipientId}`);
        if (!response.ok) {
          console.error("Error fetching chat history:", response.status);
          return; // Handle error appropriately
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://gp-backend-api.onrender.com/chatHub?uid=${getId(getToken("access"))}`, {
        withCredentials: true,
        accessTokenFactory: () => getId(getToken("access")),
      })
      .build();

    setConnection(newConnection);
    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR");
      })
      .catch((err) => console.error("Connection failed: ", err));

    newConnection.on("receiveMessage", (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup connection on component unmount
    return () => {
      newConnection.stop();
    };
  }, [recipientId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || selectedImage || selectedFile) {
      try {
        let messageData = {
          senderId: getId(getToken("access")),
          recipientId: recipientId,
          type: selectedImage ? "image" : selectedFile ? "file" : "text",
        };

        if (newMessage.trim()) {
          messageData.content = newMessage;
        } else if (selectedImage) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            messageData.content = e.target.result; // Base64 encoded image
            await connection.invoke("sendMessage", messageData);
            resetInputs();
          };
          reader.readAsDataURL(selectedImage);
        } else if (selectedFile) {
          // Handle file upload (adapt based on your backend)
          const formData = new FormData();
          formData.append('file', selectedFile);
          const response = await fetch('/uploadFile', { method: 'POST', body: formData });
          const data = await response.json();
          messageData.content = data.fileUrl; // URL of the uploaded file
          await connection.invoke("sendMessage", messageData);
          resetInputs();
        }

        // Clear inputs if sending text message
        if (newMessage.trim()) {
          await connection.invoke("sendMessage", messageData);
          resetInputs();
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const resetInputs = () => {
    setNewMessage("");
    setSelectedImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="fixed bottom-0 right-5 m-4 bg-black/50 flex items-end justify-end z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <FaTimes size={20} />
        </button>
        <div className="flex items-center mb-4">
          <img
            src={`../assets/img/doc${doctor.id}.jpg`}
            alt={doctor.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <h3 className="text-lg font-medium">{doctor.name}</h3>
        </div>

        {/* Chat messages */}
       
    <div className="h-48 overflow-y-auto p-2">
      {messages.map((message, index) => (
        <div key={index} className={`flex mb-2 items-end ${message.senderId === getId(getToken("access")) ? 'justify-end' : 'justify-start'}`}>
          <div className={`px-4 py-3 rounded-lg shadow-md max-w-xs ${message.senderId === getId(getToken("access")) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-900'}`}>
            {message.type === 'text' && <p className="whitespace-pre-line">{message.content}</p>}
            {message.type === 'image' && <img src={message.content} alt="Message Image" className="w-full h-auto" onError={(e) => {e.target.src = '/placeholder.jpg';}} />} {/*Added error handling*/}
            {message.type === 'file' && <a href={message.content} download>Download File</a>}
          </div>
        </div>
      ))}
    </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 px-1 py-1 border border-gray-300 rounded"
            placeholder="Write your message here..."
          />

          <label htmlFor="fileInput" className="hover:text-gray-700 text-gray-400 font-bold py-2 px-2 rounded cursor-pointer flex items-center">
            <FaUpload className="mr-2" />
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*, .pdf, .txt"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.type.startsWith('image/')) {
                  setSelectedImage(file);
                } else {
                  setSelectedFile(file);
                }
              }
            }}
            style={{ display: "none" }}
          />

          <button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};


export default Doctors;