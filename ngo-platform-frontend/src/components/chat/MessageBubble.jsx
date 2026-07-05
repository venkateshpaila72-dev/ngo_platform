import { formatDateTime } from '../../utils/formatDate.js';

const SENDER_TYPE_LABELS = {
  ngo: 'NGO',
  volunteer: 'Volunteer',
  admin: 'Admin',
};

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
          isOwn ? 'bg-primary text-white' : 'bg-card border border-borderc text-foreground'
        }`}
      >
        <p className={`text-xs font-semibold mb-0.5 ${isOwn ? 'text-white/80' : 'text-muted'}`}>
          {SENDER_TYPE_LABELS[message.sender_type] || message.sender_type}
        </p>
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        {message.created_at && (
          <p className={`text-[11px] mt-1 ${isOwn ? 'text-white/60' : 'text-muted/70'}`}>
            {formatDateTime(message.created_at)}
          </p>
        )}
      </div>
    </div>
  );
}