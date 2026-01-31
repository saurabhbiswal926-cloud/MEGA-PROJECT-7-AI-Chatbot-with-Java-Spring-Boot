import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import { useAuth } from '../context/AuthContext';
import { ClipboardPaste, Paperclip, X, FileText } from 'lucide-react';
import api from '../services/api';

interface ChatWindowProps {
    conversationId?: number;
    onConversationUpdate?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onConversationUpdate }) => {
    const [input, setInput] = useState('');
    const [attachment, setAttachment] = useState<{ url: string, type: string, name: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { messages, sendMessage, isConnected, isTyping } = useChat(conversationId, onConversationUpdate);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { username } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [input]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() || attachment) {
            sendMessage(input, attachment ? { url: attachment.url, type: attachment.type } : undefined);
            setInput('');
            setAttachment(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/attachments/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Attachment response from backend has url and type
            setAttachment({
                url: res.data.url,
                type: res.data.type,
                name: file.name
            });
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file. Please check your Supabase Storage configuration.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleEdit = (content: string) => {
        if (!content) return;
        setInput(content);
        if (textareaRef.current) {
            textareaRef.current.focus();
            const length = content.length;
            textareaRef.current.setSelectionRange(length, length);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setInput(prev => (prev || '') + text);
                textareaRef.current?.focus();
            }
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4">
            {/* Connection Status */}
            {!isConnected && (
                <div className="bg-red-900/30 text-red-500 dark:text-red-400 text-xs py-1 px-3 rounded-full mx-auto mt-4 border border-red-800 animate-pulse">
                    Reconnecting to server...
                </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto pt-8 pb-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-[#2f2f2f] rounded-2xl flex items-center justify-center text-3xl">🤖</div>
                        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">How can I help you today?</h2>
                        <p className="text-sm max-w-xs text-center opacity-70">
                            Start a conversation by typing a message below.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <ChatMessage
                            key={idx}
                            content={msg.content}
                            sender={msg.sender}
                            isUser={msg.sender === username}
                            status={msg.status}
                            attachmentUrl={msg.attachmentUrl}
                            attachmentType={msg.attachmentType}
                            onEdit={handleEdit}
                        />
                    ))
                )}

                {isTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex gap-4 max-w-[85%] group">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0 shadow-lg shadow-blue-500/20">
                                🤖
                            </div>
                            <div className="bg-gray-100 dark:bg-[#2f2f2f] text-gray-700 dark:text-gray-300 rounded-2xl rounded-tl-none px-4 py-3 shadow-md border border-gray-200 dark:border-gray-700">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="pb-8 pt-2">
                <form
                    onSubmit={handleSend}
                    className="relative group bg-white dark:bg-[#2f2f2f] rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500/50 transition-all shadow-lg dark:shadow-xl"
                >
                    {/* Attachment Preview */}
                    {attachment && (
                        <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-500 overflow-hidden">
                                {attachment.type.startsWith('image/') ? (
                                    <img src={attachment.url} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <FileText size={20} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium dark:text-gray-300 truncate">{attachment.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{attachment.type.split('/')[1]}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAttachment(null)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="absolute inset-x-0 -top-1 h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 animate-[loading_1.5s_infinite]" style={{ width: '40%' }}></div>
                        </div>
                    )}

                    <div className="flex items-end">
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="p-4 mr-1 rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all"
                            title="Attach a file"
                        >
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Message Saurabh AI..."
                            className="w-full bg-transparent text-gray-900 dark:text-white py-4 pr-12 focus:outline-none resize-none min-h-[56px] max-h-40"
                            rows={1}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                title="Paste from clipboard"
                            >
                                <ClipboardPaste size={18} />
                            </button>
                            <button
                                type="submit"
                                disabled={(!(input || '').trim() && !attachment) || !isConnected || isUploading}
                                className={`p-2 rounded-xl transition-all ${((input || '').trim() || attachment) && isConnected && !isUploading
                                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
                <div className="mt-2 text-[10px] text-center text-gray-500">
                    Saurabh AI can make mistakes. Verify important information.
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
