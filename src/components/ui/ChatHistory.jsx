import { User, Bot } from "lucide-react";

const ChatHistory = ({ messages }) => {
  return (
    <>
      <div className="p-5 h-full mb-10">
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[70%] ${
                      isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg whitespace-pre-wrap ${
                        isUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <div
                      className={`rounded-full p-2 ${
                        isUser ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {isUser ? (
                        <User size={20} className="text-blue-500" />
                      ) : (
                        <Bot size={20} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-white text-center">No Messages Available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHistory;