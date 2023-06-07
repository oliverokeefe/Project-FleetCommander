"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET types.
 */
const express = require("express");
const path = require("path");
const router = express.Router();
const typeSrcPath = '../src/types';
router.use((req, res) => {
    res.sendFile(path.join(__dirname, typeSrcPath, path.basename(req.url)));
});
//router.get('/types.js', (req: express.Request, res: express.Response) => {
//    res.sendFile(path.join(__dirname, typeSrcPath, 'types.js'));
//});
exports.default = router;
//# sourceMappingURL=types.js.map