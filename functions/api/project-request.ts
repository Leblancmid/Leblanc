/**
 * POST /api/project-request: someone wants a website or business system built. Saved as a lead
 * (the Budget app's Leads page and phone alerts pick it up) and posted to #inquiries.
 */
import { contactMarkdown } from '../../src/lib/inquiry'
import { PROJECT_KINDS, validateProject } from '../../src/lib/project'
import { json, looksLikeBot, postToDiscord, readJson, sameOrigin, type Context } from '../../server/http'
import { saveLead } from '../../server/leads'

const FALLBACK = 'Please message Leblanc on Discord instead.'

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DISCORD_WEBHOOK_URL && !env.DB) return json({ message: `Project requests aren't switched on yet. ${FALLBACK}` }, 503)
  if (!sameOrigin(request)) return json({ message: 'Not allowed.' }, 403)

  const raw = await readJson(request, 6000)
  if (!raw) return json({ message: 'Invalid request.' }, 400)
  if (looksLikeBot(raw)) return json({ ok: true })

  const result = validateProject(raw)
  if (!result.ok) return json({ message: 'Please check the form.', errors: result.errors }, 422)
  const p = result.value

  const saved = await saveLead(env, {
    type: 'project', name: p.name, method: p.method, contact: p.contact,
    details: { kind: p.kind, message: p.details, budget: p.budget || null, timeline: p.timeline || null },
  })
  const posted = await postToDiscord(env, {
    embeds: [{
      title: `🛠️ Website request: ${PROJECT_KINDS[p.kind]}`,
      description: p.details.slice(0, 4000),
      color: 0x6366f1,
      fields: [
        { name: 'From', value: p.name, inline: true },
        { name: 'Contact', value: contactMarkdown(p.method, p.contact), inline: true },
        ...(p.budget ? [{ name: 'Budget', value: p.budget, inline: true }] : []),
        ...(p.timeline ? [{ name: 'Needed by', value: p.timeline, inline: true }] : []),
      ],
      timestamp: new Date().toISOString(),
    }],
  }).catch(() => false)

  if (!saved && !posted) return json({ message: `Couldn't send right now. ${FALLBACK}` }, 502)
  return json({ ok: true })
}
