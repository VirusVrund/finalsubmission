import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: get or create reporter_id for a given from_phone
async function getOrCreateReporterId(from_phone) {
    // Try to find existing reporter_id
    let { data, error } = await supabase
        .from('whatsapp_reporters')
        .select('reporter_id')
        .eq('from_phone', from_phone)
        .single();
    if (data && data.reporter_id) return data.reporter_id;
    // If not found, create new
    ({ data, error } = await supabase
        .from('whatsapp_reporters')
        .insert([{ from_phone }])
        .select('reporter_id')
        .single());
    if (data && data.reporter_id) return data.reporter_id;
    throw new Error('Could not get or create reporter_id');
}

// POST /api/whatsapp/process-message
// Body: { from_phone, body, photo_url }
router.post('/process-message', async (req, res) => {
    const { from_phone, body, photo_url } = req.body;
    if (!from_phone || !body) return res.status(400).json({ error: 'from_phone and body required' });
    try {
        // 1. Get or create reporter_id
        const reporter_id = await getOrCreateReporterId(from_phone);

        // 2. Call Gemini API for description and category
        const geminiPrompt = `Clean and summarize this WhatsApp message as a mangrove incident report. Classify it as one of: Illegal Cutting, Land Reclamation, Pollution, Other.\nMessage: "${body}"\nReturn JSON: { description, category }`;
        let geminiData;
        try {
            const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDt2jBly4qwwNwpubmS6HsLNO2agGm2uKI', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] })
            });
            geminiData = await geminiRes.json();
        } catch (e) {
            console.error('Gemini API call failed:', e);
            return res.status(500).json({ error: 'Gemini API call failed', details: e.toString() });
        }
        let description = '', category = '';
        try {
            let text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            // Remove Markdown code block if present
            text = text.trim();
            if (text.startsWith('```json')) {
                text = text.replace(/^```json[\r\n]+/, '').replace(/```$/, '').trim();
            } else if (text.startsWith('```')) {
                text = text.replace(/^```[\w]*[\r\n]+/, '').replace(/```$/, '').trim();
            }
            const parsed = JSON.parse(text);
            description = parsed.description || '';
            category = parsed.category || '';
        } catch (e) {
            console.error('Gemini parsing failed:', e, 'Gemini response:', geminiData);
            return res.status(500).json({ error: 'Gemini parsing failed', geminiData });
        }

        // 3. Insert into incidents table
        const { error: insertError } = await supabase.from('incidents').insert([
            {
                reporter_id,
                description,
                category,
                latitude: 0,
                longitude: 0,
                photo_url: photo_url || null,
                status: 'pending',
                created_at: new Date().toISOString(),
                source: 'whatsapp'
            }
        ]);
        if (insertError) {
            console.error('Incident insert failed:', insertError.message);
            return res.status(500).json({ error: insertError.message });
        }

        res.json({ success: true, reporter_id, description, category });
    } catch (err) {
        console.error('Unexpected error in /process-message:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
