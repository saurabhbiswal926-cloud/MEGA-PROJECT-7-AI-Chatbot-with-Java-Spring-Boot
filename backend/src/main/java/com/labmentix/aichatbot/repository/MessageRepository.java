package com.labmentix.aichatbot.repository;

import com.labmentix.aichatbot.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationId(Long conversationId);

    List<Message> findAllByTimestampAfter(LocalDateTime timestamp);

    long countByType(com.labmentix.aichatbot.model.MessageType type);
}
