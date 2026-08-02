import emailjs from '@emailjs/browser';

/* EmailJS templates (configured in the EmailJS dashboard, not here):
 *   NOTIFY    → delivers the enquiry to the team inbox (hello@dawnember.in).
 *               Critical: if this fails, the lead is lost, so we surface an
 *               error to the visitor.
 *   AUTOREPLY → the branded "thank you" sent back to the visitor. Best-effort:
 *               a failure here is logged but does NOT fail the submission, so a
 *               flaky auto-reply never makes a real lead think they didn't get
 *               through.
 *
 * ⚠️ Confirm this mapping matches your EmailJS dashboard (which template's
 * "To email" is hello@ vs {{email}}). If the IDs are reversed, swap them below. */
const NOTIFY_TEMPLATE_ID = 'template_jgqvpvd';
const AUTOREPLY_TEMPLATE_ID = 'template_itkyusm';

export interface SendThnxParams {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export async function sendThnx(params: SendThnxParams): Promise<void> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !publicKey) {
        throw new Error(
            'EmailJS is not configured — set VITE_EMAILJS_SERVICE_ID and ' +
            'VITE_EMAILJS_PUBLIC_KEY in your .env (see .env.example).',
        );
    }

    const templateParams = {
        name: params.name,
        email: params.email,
        phone: params.phone,
        message: params.message,
    };

    // Fire both concurrently but grade them independently — the notification must
    // succeed; the auto-reply is best-effort.
    const [notify, autoreply] = await Promise.allSettled([
        emailjs.send(serviceId, NOTIFY_TEMPLATE_ID, templateParams, publicKey),
        emailjs.send(serviceId, AUTOREPLY_TEMPLATE_ID, templateParams, publicKey),
    ]);
    if (autoreply.status === 'rejected') {
        console.warn('EmailJS auto-reply failed (non-fatal):', autoreply.reason);
    }
    if (notify.status === 'rejected') {
        // EmailJS rejects with a { status, text } object (NOT an Error), so surface
        // that real reason instead of a generic message — e.g. 422 "The recipients
        // address is empty" or 400 "template ID not found".
        const r = notify.reason;
        console.error('EmailJS notification failed:', r);
        const detail = r?.text ? `EmailJS ${r.status ?? ''}: ${r.text}` : (r?.message ?? String(r));
        throw new Error(detail || 'Failed to send your enquiry.');
    }
}
