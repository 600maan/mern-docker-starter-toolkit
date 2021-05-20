const router = require('express').Router();
const mongoose = require('mongoose');
const authentication = require('../../middlewares/authentication');
// @route:  GET api/food-and-beverage/
// @desc:   get all the non isDeleted food and beverage item
// @access: private
router.get('/count', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  const getCount = async (modelName) => mongoose.model(modelName).count(filterQuery);
  try {
    const countValue = {};
    // get all counts
    countValue['food-beverage'] = await getCount('food-beverage') || 0;
    countValue['beauty-health'] = await getCount('beauty-health') || 0;
    countValue['community-forum'] = await getCount('community-forum') || 0;
    countValue['job-portal'] = await getCount('job-portal') || 0;
    countValue['retail-wholesale'] = await getCount('retail-wholesale') || 0;
    countValue['rsvp-product'] = await getCount('rsvp-product') || 0;
    countValue['travel-tour'] = await getCount('travel-tour') || 0;

    res.json({ data: countValue });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});
module.exports = router;
