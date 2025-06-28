import React, { useState, useEffect, useRef } from 'react';
import VetLayout from './VetLayout';
import { 
  getVetServiceRequests,
  getChatMessages, 
  sendChatMessage, 
  uploadChatFile,
  markMessagesAsRead
} from '../../services/vetService';
import { FaSearch, FaUser, FaPaperPlane, FaImage, FaFile, FaTimes, FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VetChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      markMessagesAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVetServiceRequests();
      console.log('Chats response:', response); // Debug log
      
      if (!Array.isArray(response)) {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
        setChats([]);
        return;
      }

      const chatList = response.map(request => ({
        id: request.id,
        farmer_name: request.farmer?.name || 'Unknown Farmer',
        last_message: request.description || 'No message',
        unread_count: 0,
        last_seen: new Date(request.updated_at).toLocaleString(),
        status: request.status,
        service_type: request.purpose || 'General Consultation', // Changed from service_type to purpose
        pig_name: request.pig?.name || 'Unknown Pig'
      }));
      
      console.log('Processed chat list:', chatList); // Debug log
      setChats(chatList);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to fetch chats. Please try again later.');
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (requestId) => {
    try {
      const response = await getChatMessages(requestId);
      setMessages(response);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      await sendChatMessage(selectedChat.id, newMessage);

      if (attachments.length > 0) {
        for (const file of attachments) {
          await uploadChatFile(selectedChat.id, file);
        }
      }

      setNewMessage('');
      setAttachments([]);
      fetchMessages(selectedChat.id);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredChats = chats.filter(chat =>
    chat.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.pig_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <VetLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </VetLayout>
    );
  }

  if (error) {
    return (
      <VetLayout>
        <div className="flex flex-col items-center justify-center h-screen text-red-600">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </VetLayout>
    );
  }

  return (
    <VetLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat List */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by farmer, pig, or service type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800 truncate">{chat.farmer_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        chat.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        chat.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        chat.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {chat.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaPiggyBank className="text-gray-400" />
                      <span className="truncate">{chat.pig_name}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.service_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedChat.farmer_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaPiggyBank className="text-gray-400" />
                      <span>{selectedChat.pig_name}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedChat.service_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_vet ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${
                        message.is_vet
                          ? 'bg-blue-600 text-white ml-12'
                          : 'bg-gray-100 text-gray-800 mr-12'
                      }`}
                    >
                      {/* Message Header */}
                      <div className={`flex items-center gap-2 mb-2 ${message.is_vet ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-medium text-sm">
                          {message.is_vet ? 'You' : message.sender_name || 'Farmer'}
                        </span>
                        <span className={`text-xs ${message.is_vet ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className={`whitespace-pre-wrap break-words text-sm ${
                        message.is_vet ? 'text-white' : 'text-gray-700'
                      }`}>
                        {message.message || message.content}
                      </div>

                      {/* Attachments */}
                      {message.attachments?.map((attachment, index) => (
                        <div key={index} className="mt-2">
                          {attachment.type.startsWith('image/') ? (
                            <img
                              src={attachment.url}
                              alt="Attachment"
                              className="max-w-full rounded-lg"
                            />
                          ) : (
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 text-sm underline ${
                                message.is_vet ? 'text-blue-100 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              <FaFile className={message.is_vet ? 'text-blue-200' : 'text-gray-400'} />
                              {attachment.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t bg-white">
                {attachments.length > 0 && (
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 rounded-lg p-2"
                      >
                        <FaFile className="text-gray-400" />
                        <span className="text-sm truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FaImage className="text-gray-600" />
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </VetLayout>
  );
};

export default VetChat;