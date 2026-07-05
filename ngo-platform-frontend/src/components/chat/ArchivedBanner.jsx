export default function ArchivedBanner() {
  return (
    <div className="bg-accent/10 border border-accent/30 text-accent text-sm font-medium rounded-lg px-4 py-2.5 text-center">
      This task is closed, so its chat room is archived. You can still read the history below,
      but new messages can no longer be sent.
    </div>
  );
}