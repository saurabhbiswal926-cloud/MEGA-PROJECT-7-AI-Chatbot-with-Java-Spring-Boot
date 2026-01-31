package com.labmentix.aichatbot.service;

import com.labmentix.aichatbot.dto.AnalyticsDTO;
import com.labmentix.aichatbot.model.Message;
import com.labmentix.aichatbot.repository.ConversationRepository;
import com.labmentix.aichatbot.repository.MessageRepository;
import com.labmentix.aichatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public AnalyticsDTO getStats() {
        long totalUsers = userRepository.count();
        long totalMessages = messageRepository.count();
        long totalConversations = conversationRepository.count();

        // Messages per day for the last 7 days
        Map<String, Long> messagesPerDay = getMessagesPerDay(7);

        // Top 5 conversations
        List<AnalyticsDTO.ConversationStat> topConversations = conversationRepository
                .findTopConversations(PageRequest.of(0, 5))
                .stream()
                .map(c -> AnalyticsDTO.ConversationStat.builder()
                        .title(c.getTitle())
                        .messageCount(c.getMessages() != null ? c.getMessages().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return AnalyticsDTO.builder()
                .totalUsers(totalUsers)
                .totalMessages(totalMessages)
                .totalConversations(totalConversations)
                .messagesPerDay(messagesPerDay)
                .topConversations(topConversations)
                .build();
    }

    private Map<String, Long> getMessagesPerDay(int days) {
        LocalDateTime start = LocalDateTime.now().minusDays(days).withHour(0).withMinute(0).withSecond(0);
        List<Message> recentMessages = messageRepository.findAllByTimestampAfter(start);

        Map<String, Long> stats = new TreeMap<>(); // Sorted by date string
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Initialize all days with 0
        for (int i = 0; i < days; i++) {
            stats.put(LocalDate.now().minusDays(i).format(formatter), 0L);
        }

        recentMessages.forEach(m -> {
            String date = m.getTimestamp().format(formatter);
            if (stats.containsKey(date)) {
                stats.put(date, stats.get(date) + 1);
            }
        });

        return stats;
    }
}
