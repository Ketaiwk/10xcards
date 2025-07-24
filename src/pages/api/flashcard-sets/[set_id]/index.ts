import type { APIRoute } from 'astro';
import { FlashcardSetService } from '@/lib/services/flashcard-set.service';
import { updateFlashcardSetSchema } from '@/lib/schemas/flashcard-set.schema';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { set_id } = params;
    if (!set_id) {
      return new Response(JSON.stringify({ error: 'Set ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const service = new FlashcardSetService(locals.supabase);
    const result = await service.getById(locals.user.id, set_id);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error.message === 'Flashcard set not found') {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Error getting flashcard set:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  try {
    if (!locals.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { set_id } = params;
    if (!set_id) {
      return new Response(JSON.stringify({ error: 'Set ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const json = await request.json();
    const validatedData = updateFlashcardSetSchema.parse(json);

    const service = new FlashcardSetService(locals.supabase);
    const result = await service.update(locals.user.id, set_id, validatedData);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return new Response(JSON.stringify({ 
        error: 'Validation error',
        details: error.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.message === 'Flashcard set not found') {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Error updating flashcard set:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
