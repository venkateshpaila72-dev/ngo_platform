import { useCallback, useEffect, useRef, useState } from 'react';
import { getMessages, postMessage } from '../../api/chat.js';
import { useAuth } from '../../context/AuthContext.jsx';
import usePolling from '../../hooks/usePolling.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Button from '../common/Button.jsx';
import MessageBubble from './MessageBubble.jsx';
import ArchivedBanner from './ArchivedBanner.jsx';

const POLL_INTERVAL_MS = 4000;

export default function ChatRoom({ taskId }) {
  const { session } = useAuth();
  const [messages, setMessages] = useState(null);
  const [archived, setArchived] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const hasLoadedOnce = useRef(false);

  const load = useCallback(async () => {
    const data = await getMessages(taskId);
    const sorted = [...(data.messages || [])].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    setMessages(sorted);
    setArchived(!!data.archived);
    hasLoadedOnce.current = true;
  }, [taskId]);

  // Stop polling once archived — the room can no longer receive new
  // messages, so there's nothing new to fetch.
  usePolling(load, POLL_INTERVAL_MS, !!taskId && !archived);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !session) return;
    setSending(true);
    try {
      await postMessage(taskId, session.id, session.role, text.trim());
      setText('');
      await load();
    } finally {
      setSending(false);
    }
  };

  if (!hasLoadedOnce.current && messages === null) {
    return <LoadingSpinner label="Loading chat..." />;
  }

  return (
    <div className="bg-card border border-borderc rounded-xl overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-borderc">
        <p className="font-heading font-semibold text-foreground">Task chat</p>
      </div>

      {archived && (
        <div className="px-5 pt-4">
          <ArchivedBanner />
        </div>
      )}

      <div ref={scrollRef} className="flex-1 max-h-96 overflow-y-auto px-5 py-4 space-y-3">
        {messages && messages.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            No messages yet. Say hello to get things moving.
          </p>
        ) : (
          messages?.map((m) => (
            <MessageBubble key={m.id} message={m} isOwn={m.sender_id === session?.id} />
          ))
        )}
      </div>

      {!archived && (
        <form onSubmit={handleSubmit} className="border-t border-borderc p-3 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" loading={sending} disabled={!text.trim()}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
}