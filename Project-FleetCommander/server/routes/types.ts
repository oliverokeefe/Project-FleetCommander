/*
 * GET types.
 */
import express = require('express');
import path = require('path');

const router = express.Router();
const typeSrcPath = '../src/types';

router.use((req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, typeSrcPath, path.basename(req.url)));
});

//router.get('/types.js', (req: express.Request, res: express.Response) => {
//    res.sendFile(path.join(__dirname, typeSrcPath, 'types.js'));
//});

export default router;