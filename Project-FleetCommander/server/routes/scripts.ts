/*
 * GET scripts.
 */
import express = require('express');
import path = require('path');

const router = express.Router();
const scriptsSrcPath = '../src/scripts'

router.use((req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, scriptsSrcPath, path.basename(req.url)));
});

export default router;