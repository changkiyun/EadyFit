package backend.goorm.chat.service;

import backend.goorm.chat.model.entity.Chat;
import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRequest;
import backend.goorm.chat.model.response.ChatResponse;
import backend.goorm.chat.repository.ChatRepository;
import backend.goorm.chat.repository.ChatRoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;

    public ChatResponse sendChat(Long roomId, ChatRequest chatRequest) {

        ChatRoom findChatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() ->new RuntimeException(roomId + "번 채팅방이 존재하지 않습니다."));

        Chat newChat = new Chat();
        newChat.setChatRoom(findChatRoom);
        newChat.setSender(chatRequest.getSender());
        newChat.setMessage(chatRequest.getMessage());
        newChat.setSendDate(LocalDateTime.now());

        Chat saved = chatRepository.save(newChat);

        return ChatResponse.changeResponse(saved);
    }

    public List<ChatResponse> chatHistory(Long chatRoomId) {
        return chatRepository.findByChatRoom_ChatRoomId(chatRoomId)
                .stream()
                .map(ChatResponse::changeResponse)
                .collect(Collectors.toList());

    }
}