import { neon } from '@neondatabase/serverless';

export default function CommentsPage() {
  async function create(formData: FormData) {
    'use server';

    // Conectar a Neon con la URL de entorno
    const sql = neon(process.env.DATABASE_URL!);

    const comment = formData.get('comment');

    if (typeof comment !== 'string' || comment.trim() === '') {
      throw new Error('Comment is required');
    }

    await sql`INSERT INTO comments (comment) VALUES (${comment})`;  
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Leave a Comment</h1>
      <form action={create}>
        <input type="text" name="comment" placeholder="Write a comment" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
