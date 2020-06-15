"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET test listing.
 */
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.send("respond with a BLANK resource");
});
router.get('/testFileName.js', (req, res) => {
    res.send(__dirname);
});
exports.default = router;
//# sourceMappingURL=testRoute.js.map