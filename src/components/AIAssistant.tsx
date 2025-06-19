import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('graduin-chat-history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Initialize with welcome message if no valid history
        initializeChat();
      }
    } else {
      initializeChat();
    }

    // Clear chat history when user leaves the website
    const handleBeforeUnload = () => {
      localStorage.removeItem('graduin-chat-history');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('graduin-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 1,
      text: "Hi! I'm your Graduin AI assistant. I'm here to help you with university applications, course selection, accommodation, and all things related to Graduin's services. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectName = (text: string) => {
    const namePatterns = [
      /my name is (\w+)/i,
      /i'm (\w+)/i,
      /i am (\w+)/i,
      /call me (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const isGreeting = (text: string) => {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(greeting => text.toLowerCase().includes(greeting));
  };

  const isContactRequest = (text: string) => {
    const contactKeywords = ['contact support', 'speak to someone', 'human help', 'customer service', 'support team', 'help me contact', 'talk to agent', 'live chat', 'personal assistance'];
    return contactKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const hasAskedBefore = (userInput: string) => {
    return conversationHistory.some(prevInput => 
      prevInput.toLowerCase().trim() === userInput.toLowerCase().trim()
    );
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const isRepeat = hasAskedBefore(userInput);

    // Handle greetings
    if (isGreeting(input)) {
      if (isRepeat) {
        return "I see you're greeting me again! Is there something specific I can help you with regarding your university journey or Graduin's services?";
      }
      return "Hello! Welcome to Graduin. I'm here to help you with anything related to our university application platform, course finder, student accommodation, and more. What would you like assistance with today?";
    }

    // Handle contact requests
    if (isContactRequest(input)) {
      if (isRepeat) {
        return "You mentioned wanting to speak with our support team earlier. Would you like me to connect you with personalized assistance right now?";
      }
      return "I'd be happy to connect you with our support team for further assistance. Please use the contact button below to reach out to our support team directly.";
    }

    // Handle university/institution queries
    if (input.includes('university') || input.includes('institution') || input.includes('college')) {
      if (isRepeat) {
        return "I notice you're asking about universities again. Are you looking for something more specific? We have partnerships with 20 traditional universities, 6 universities of technology, and 25 private institutions. Would you like personalized guidance to find the right fit for you?";
      }
      return "Graduin partners with over 50+ South African institutions including traditional universities, universities of technology, and private institutions. You can browse all available institutions on our Institutions page, where you can apply to multiple universities with a single application. Would you like help finding specific institutions or courses?";
    }

    // Handle course queries
    if (input.includes('course') || input.includes('program') || input.includes('study') || input.includes('degree')) {
      if (isRepeat) {
        return "You're still exploring course options? That's great! Would you benefit from personalized course recommendations based on your interests and career goals? I can connect you with our support team for tailored guidance.";
      }
      return "Our Course Finder helps you discover the perfect program for your interests and career goals. We offer courses across various fields including Engineering, Business, Health Sciences, Information Technology, Arts, and more. You can also take our Career Assessment to get personalized course recommendations. Would you like me to guide you to the Course Finder?";
    }

    // Handle accommodation queries
    if (input.includes('accommodation') || input.includes('housing') || input.includes('residence') || input.includes('room')) {
      if (isRepeat) {
        return "Still searching for the perfect accommodation? Our team can provide personalized assistance to help you find housing that meets your specific needs and budget. Would you like me to connect you with our accommodation specialists?";
      }
      return "Graduin offers a comprehensive accommodation marketplace with properties across South Africa. We have student residences, shared accommodation, and private rentals near major universities. You can search by location, price range, and amenities. Our accommodation page has detailed listings with photos, prices, and contact information. Need help finding accommodation in a specific area?";
    }

    // Handle application queries
    if (input.includes('apply') || input.includes('application') || input.includes('admission')) {
      if (isRepeat) {
        return "I see you're still interested in the application process. Would you like step-by-step guidance tailored to your specific situation? Our support team can provide personalized assistance with your applications.";
      }
      return "With Graduin, you can apply to multiple universities and institutions with just one application! Our platform streamlines the entire process - simply fill out your information once, select your preferred institutions, and submit. You can track your applications and receive updates directly through our platform. Would you like help starting an application?";
    }

    // Handle career assessment queries
    if (input.includes('career') || input.includes('assessment') || input.includes('test') || input.includes('guidance')) {
      if (isRepeat) {
        return "Considering the career assessment again? It's a valuable tool! Would you like personalized career guidance from our team to complement the assessment results?";
      }
      return "Our Career Assessment Test helps you discover your ideal career path and study recommendations based on your interests, strengths, and goals. The assessment analyzes your preferences and provides personalized suggestions for courses and institutions. You can access this free tool from our Course Finder page. Would you like to take the assessment?";
    }

    // Handle pricing/cost queries
    if (input.includes('price') || input.includes('cost') || input.includes('fee') || input.includes('money')) {
      if (isRepeat) {
        return "Cost is definitely an important factor in your decision. Would you like personalized financial guidance and information about funding options available to you?";
      }
      return "Application fees vary by institution, ranging from free applications to around R440. Many institutions offer affordable options, and we provide detailed pricing information for each institution. For accommodation, prices typically range from R2,500 to R12,000+ per month depending on location and amenities. You can filter by price range on both our Institutions and Accommodation pages.";
    }

    // Handle location queries
    if (input.includes('johannesburg') || input.includes('cape town') || input.includes('durban') || input.includes('pretoria') || input.includes('location')) {
      if (isRepeat) {
        return "Looking at locations again? Each city offers unique opportunities. Would you like personalized advice about which location might be best for your specific field of study and career goals?";
      }
      return "Graduin covers institutions and accommodation across all major South African cities including Johannesburg, Cape Town, Durban, Pretoria, and more. You can search by specific locations on our platform. Many of our accommodation listings are strategically located near major universities for easy access to campus.";
    }

    // Handle general help
    if (input.includes('help') || input.includes('how') || input.includes('what')) {
      if (isRepeat) {
        return "I'm here to help! Since you're asking again, would you prefer to speak with one of our human specialists who can provide more detailed, personalized assistance?";
      }
      return "I can help you with:\n• Finding and applying to universities\n• Discovering courses and career paths\n• Searching for student accommodation\n• Taking career assessments\n• Understanding application processes\n• General information about Graduin's services\n\nWhat specific area would you like help with?";
    }

    // Default response for repeated or out-of-scope queries
    if (isRepeat) {
      return "I notice you're asking about this again. Would you like me to connect you with our support team for more personalized assistance? They can provide detailed guidance tailored to your specific needs.";
    }

    return "I'm here to help with Graduin's services including university applications, course selection, student accommodation, and career guidance. For more specialized assistance beyond what I can provide, would you like me to connect you with our support team?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, inputMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Detect name in user message
    const detectedName = detectName(inputMessage);
    if (detectedName && !userName) {
      setUserName(detectedName);
    }

    // Generate response
    let responseText = generateResponse(inputMessage);

    // Add user's name to response if we have it
    if (userName || detectedName) {
      const name = detectedName || userName;
      if (!responseText.includes(name) && !responseText.includes('I notice') && !responseText.includes('You mentioned')) {
        responseText = `${name}, ${responseText}`;
      }
    }

    const aiMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleContactSupport = () => {
    // Navigate to contact page
    window.dispatchEvent(new CustomEvent('changePage', { detail: 'contact-us' }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-full max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Graduin AI Assistant</h3>
              <p className="text-xs text-slate-500">Online now</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isUser 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}>
                <div className="flex items-start gap-2">
                  {!message.isUser && (
                    <Bot size={16} className="mt-1 text-purple-600" />
                  )}
                  <div className="text-sm whitespace-pre-line">{message.text}</div>
                  {message.isUser && (
                    <User size={16} className="mt-1 text-white/80" />
                  )}
                </div>
                {!message.isUser && (isContactRequest(message.text) || message.text.includes('connect you with our support team') || message.text.includes('personalized assistance')) && (
                  <button
                    onClick={handleContactSupport}
                    className="mt-2 bg-purple-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-600 transition-colors"
                  >
                    Contact Support
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <Bot size={16} className="text-purple-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about courses, applications, or accommodation..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;