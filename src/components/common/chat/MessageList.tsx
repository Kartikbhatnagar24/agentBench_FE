import React from 'react';
import { MessageSender } from '../../../types/chat';
import type { ChatSession } from '../../../types/chat';
import { FormattedMessage } from './FormattedMessage';

type Message = ChatSession['messages'][number];

interface MessageListProps {
  messages: Message[];
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showReferences: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isSending,
  messagesEndRef,
  showReferences,
}) => {
  return (
    <div className="flex-grow overflow-y-auto scroll-area px-5 py-5 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.sender === MessageSender.USER;
        // Skip rendering empty AI messages (optimistic placeholders while streaming)
        const isEmpty = !msg.text || msg.text.trim() === '';
        if (isEmpty && !isUser) return null;

        return (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[75%] animate-fade-in ${
              isUser ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <FormattedMessage text={msg.text} showReferences={showReferences} />
              )}
            </div>
            <span className="font-mono text-[9px] text-text-tertiary mt-1.5 px-1">
              {msg.timestamp}
            </span>
          </div>
        );
      })}

      {/* Typing / streaming indicator */}
      {isSending && (
        <div className="flex flex-col mr-auto items-start animate-fade-in">
          <div className="typing-bubble px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="typing-dot w-1.5 h-1.5 rounded-full animate-bounce-dot"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};
