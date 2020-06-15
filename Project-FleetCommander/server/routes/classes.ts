/*
 * GET classes.
 */
import express = require('express');
import path = require('path');

const router = express.Router();
const classSrcPath = '../../client/public/javascripts/classes';

router.use((req: express.Request, res: express.Response) => {
    console.log(req.url);
    console.log(path.normalize(path.join(__dirname, classSrcPath, path.basename(req.url))));
    res.sendFile(path.normalize(path.join(__dirname, classSrcPath, path.basename(req.url)+'.js')));
});

//router.get('/priorityQueue.js', (req: express.Request, res: express.Response) => {
//    res.sendFile(path.join(__dirname, classSrcPath,'priorityQueue.js'));
//});

//router.get('/testControl.js', (req: express.Request, res: express.Response) => {
//    res.sendFile(path.join(__dirname, classSrcPath,'testControl.js'));
//});

//router.get('/testData.js', (req: express.Request, res: express.Response) => {
//    res.sendFile(path.join(__dirname, classSrcPath,'testData.js'));
//});

export default router;