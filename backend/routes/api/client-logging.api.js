const router = require('express').Router();
const ClientLogger = require('../../middlewares/clientSideLogging');

router.post('/log-client-errors', (req, res) => {
  ClientLogger.error(`CLIENT:- ${req.body.errorMessage}`);
  res.status(200).json({ success: true });
});

module.exports = router;
