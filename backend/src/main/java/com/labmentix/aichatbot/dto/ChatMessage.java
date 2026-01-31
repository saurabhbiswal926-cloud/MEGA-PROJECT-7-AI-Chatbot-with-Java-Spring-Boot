package com.labmentix.aichatbot.dto;

import com.labmentix.aichatbot.model.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String content;
    private String sender;
    private Long conversationId;
    private MessageType type;
    private String attachmentUrl;
    private String attachmentType;
    private MessageStatus status;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        CONVERSATION_UPDATE,
        TYPING,
        ERROR
    }
}
