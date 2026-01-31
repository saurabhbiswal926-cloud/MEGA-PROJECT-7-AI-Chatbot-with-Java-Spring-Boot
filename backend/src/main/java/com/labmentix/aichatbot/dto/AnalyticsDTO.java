package com.labmentix.aichatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalUsers;
    private long totalMessages;
    private long totalConversations;
    private Map<String, Long> messagesPerDay;
    private List<ConversationStat> topConversations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversationStat {
        private String title;
        private long messageCount;
    }
}
