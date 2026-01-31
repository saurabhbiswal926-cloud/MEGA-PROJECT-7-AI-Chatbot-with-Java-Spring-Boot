package com.labmentix.aichatbot.repository;

import com.labmentix.aichatbot.model.Conversation;
import com.labmentix.aichatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUserOrderByStartedAtDesc(User user);

    @Query("SELECT c FROM Conversation c JOIN c.messages m GROUP BY c ORDER BY COUNT(m) DESC")
    List<Conversation> findTopConversations(org.springframework.data.domain.Pageable pageable);
}
