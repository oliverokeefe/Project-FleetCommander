/*
 * GET test listing.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.send("respond with a BLANK resource");
});

router.get('/testFileName.js', (req: express.Request, res: express.Response) => {
    res.send(__dirname);
});

export default router;