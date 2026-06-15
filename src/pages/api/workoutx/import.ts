import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';
import { getById } from '@/lib/workoutx/client';

const schema = z.object({
  workoutxId: z.string().trim().min(1)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/exercises?error=csrf');
  }

  const parsed = schema.safeParse({
    workoutxId: formData.get('workoutxId')?.toString()
  });
  if (!parsed.success) return redirect('/exercises?error=invalid');

  const { workoutxId } = parsed.data;
  const userId = session.user.id;

  let wx;
  try {
    wx = await getById(workoutxId);
  } catch {
    return redirect('/exercises?error=workoutx_not_found');
  }

  const name = wx.name.charAt(0).toUpperCase() + wx.name.slice(1);
  const equipment = wx.equipment && wx.equipment !== 'Body Weight' ? wx.equipment : null;

  const existing = await prisma.exercise.findFirst({
    where: { userId, name }
  });
  if (existing) {
    await prisma.exercise.update({
      where: { id: existing.id },
      data: {
        gifUrl: wx.gifUrl || null,
        instructions: wx.instructions?.length ? JSON.stringify(wx.instructions) : null,
        targetMuscle: wx.target || null,
        secondaryMuscles: wx.secondaryMuscles?.length ? JSON.stringify(wx.secondaryMuscles) : null,
        workoutxId: wx.id || null,
        muscle: wx.target || existing.muscle,
        equipment: equipment || existing.equipment
      }
    });
    return redirect('/exercises?linked=1');
  }

  await prisma.exercise.create({
    data: {
      userId,
      name,
      muscle: wx.target || null,
      equipment,
      gifUrl: wx.gifUrl || null,
      instructions: wx.instructions?.length ? JSON.stringify(wx.instructions) : null,
      targetMuscle: wx.target || null,
      secondaryMuscles: wx.secondaryMuscles?.length ? JSON.stringify(wx.secondaryMuscles) : null,
      workoutxId: wx.id || null
    }
  });

  return redirect('/exercises?imported=1');
};
