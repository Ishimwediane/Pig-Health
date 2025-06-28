import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperclip, FaPaperPlane, FaFileDownload } from 'react-icons/fa';
import { 
  getFarmerChatMessages, 
  sendFarmerChatMessage, 
  uploadFarmerChatFile,
  downloadFarmerChatFile
} from '../../services/vetService';

const ChatSystem = ({ vet, requestId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (requestId) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Poll for new messages every 5 seconds
      return () => clearInterval(interval);
    }
  }, [requestId]);

  const loadMessages = async () => {
    try {
      const messagesData = await getFarmerChatMessages(requestId);
      setMessages(messagesData);
      setIsLoading(false);
      scrollToBottom();
    } catch (error) {
      setError('Failed to load messages. Please try again.');
      console.error('Error loading messages:', error);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setIsSending(true);
    setError(null);

    try {
      if (selectedFile) {
        await uploadFarmerChatFile(requestId, selectedFile);
        setSelectedFile(null);
      }
      
      if (newMessage.trim()) {
        await sendFarmerChatMessage(requestId, newMessage);
        setNewMessage('');
      }
      
      await loadMessages();
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const blob = await downloadFarmerChatFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to download file. Please try again.');
      console.error('Error downloading file:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Chat with Dr. {vet.user.name}</h2>
            <p className="text-sm text-gray-600">{vet.specialization}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_from_vet ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.is_from_vet
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex flex-col">
                    {message.message && (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                    )}
                    {message.file && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleFileDownload(message.file.id, message.file.filename)}
                          className={`flex items-center gap-2 text-sm hover:underline ${
                            message.is_from_vet ? 'text-blue-600' : 'text-blue-100'
                          }`}
                        >
                          <FaFileDownload />
                          {message.file.filename}
                        </button>
                      </div>
                    )}
                    <span className={`text-xs mt-1 block ${
                      message.is_from_vet ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
          {selectedFile && (
            <div className="mb-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <FaPaperclip size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={isSending || (!newMessage.trim() && !selectedFile)}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatSystem; 