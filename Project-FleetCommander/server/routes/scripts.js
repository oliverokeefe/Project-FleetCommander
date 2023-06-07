"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET scripts.
 */
const express = require("express");
const path = require("path");
const router = express.Router();
const scriptsSrcPath = '../src/scripts';
router.use((req, res) => {
    res.sendFile(path.join(__dirname, scriptsSrcPath, path.basename(req.url)));
});
exports.default = router;
//# sourceMappingURL=scripts.js.map