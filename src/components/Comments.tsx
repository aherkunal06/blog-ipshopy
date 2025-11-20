"use client";
interface Comment { id: number; content: string; }
interface Props { comments: Comment[]; }

export default function Comments({ comments }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3">Comments ({comments.length})</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-3 rounded-md mb-3 bg-gray-100 dark:bg-gray-900">
            <p className="text-sm">{comment.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}
