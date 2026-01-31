import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Edit2, FileText } from 'lucide-react';

interface MessageProps {
    sender: string;
    content: string;
    isUser: boolean;
    timestamp?: string;
    status?: 'SENT' | 'PROCESSING' | 'RECEIVED' | 'ERROR';
    attachmentUrl?: string;
    attachmentType?: string;
    onEdit?: (content: string) => void;
}

const ChatMessage: React.FC<MessageProps> = ({ sender, content, isUser, timestamp, status, attachmentUrl, attachmentType, onEdit }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 relative group`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md
                    ${isUser ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                    {sender.charAt(0).toUpperCase()}
                </div>

                {/* Message Bubble container */}
                <div className="flex flex-col relative w-full">
                    {/* Action Buttons (Hover) */}
                    <div className={`absolute -top-8 ${isUser ? 'left-0' : 'right-0'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                            title="Copy message"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                        {isUser && onEdit && (
                            <button
                                onClick={() => onEdit(content)}
                                className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                                title="Edit message"
                            >
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>

                    <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden
                        ${isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                        }`}>

                        {/* Content */}
                        <div className={`prose prose-sm max-w-none break-words ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
                            {isUser ? (
                                <p className="whitespace-pre-wrap">{content}</p>
                            ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            )}
                        </div>

                        {/* Attachments */}
                        {attachmentUrl && (
                            <div className={`mt-3 mb-2 max-w-sm rounded-lg overflow-hidden border ${isUser ? 'border-blue-400' : 'border-gray-200 dark:border-gray-700'}`}>
                                {attachmentType?.startsWith('image/') ? (
                                    <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" title="View full image">
                                        <img src={attachmentUrl} alt="attachment" className="w-full h-auto object-cover max-h-60 hover:opacity-90 transition-opacity" />
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-900/50">
                                        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-blue-500 shadow-sm">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">Attachment</p>
                                            <p className="text-[10px] opacity-50 uppercase">{attachmentType?.split('/')[1] || 'File'}</p>
                                        </div>
                                        <a
                                            href={attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                                            title="Download file"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Timestamp & Status */}
                        <div className={`flex items-center gap-1.5 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {timestamp && (
                                <span className="text-[10px] opacity-50">
                                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            {isUser && status && (
                                <span className="flex items-center">
                                    {status === 'SENT' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {status === 'RECEIVED' && (
                                        <div className="flex -space-x-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    {status === 'ERROR' && (
                                        <span className="text-red-300 text-[10px] font-bold">!</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
