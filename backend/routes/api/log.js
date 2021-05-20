const router = require('express').Router();
const passport = require('passport');
const Log = require('../../models/Log');

const auth = passport.authenticate('jwt', { session: false });

router.get('/all/:page/:limit', auth, (req, res) => {
  const page = parseInt(req.params.page, 10) || 1;
  const limit = parseInt(req.params.limit, 10) || 10;
  const options = {
    populate: 'by',
    sort: { createdAt: -1 },
    page,
    limit,
  };
  Log.paginate({}, options).then((result) => {
    res.json(
      result.docs.map((each) => ({
        action: each.action,
        message: each.to,
        by:
          each.by
          && each.by.name
          && `${each.by.name.first} ${each.by.name.last}`,
        byId: each.by && each.by._id,
        createdAt: each && each.createdAt,
        ip: each.ip,
      })),
    );
  });
});
module.exports = router;
