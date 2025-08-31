import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/reporter/points?reporter_id=xxx
router.get('/points', async (req, res) => {
    const { reporter_id } = req.query;
    if (!reporter_id) return res.status(400).json({ error: 'reporter_id required' });
    const { data, error } = await supabase
        .from('reporter_rewards')
        .select('points')
        .eq('reporter_id', reporter_id)
        .single();
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    res.json({ points: data ? data.points : 0 });
});

export default router;
