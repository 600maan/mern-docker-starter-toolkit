/* eslint-disable no-restricted-syntax */
const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');

const CommunityForumModel = require('../../models/CommunityForum');
const ThreadAnswerModel = require('../../models/ThreadAnswer');
const ClientModel = require('../../models/Client');
const validationResult = require('../../middlewares/parseValidation');
const communityEmailBodyTemplate = require('../../services/templates/communityEmailBodyTemplate');
const mailSender = require('../../services/mailer');
const logger = require('../../middlewares/logging');

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

router.get('/test', (req, res) => {
  res.send('<h1>Community Forum API is live</h1>');
});

// @route:  GET api/community-forum/
// @desc:   get all the non isDeleted community forum item with threadcount
// @access: private
router.get('/question-list-with-count-answer', auth, async (req, res) => {
  try {
    const totalResult = await CommunityForumModel.find({ isDeleted: false, activeStatus: true })
      .populate({
        path: 'userId',
        match: { isDeleted: false, activeStatus: true },
        select: ' _id name ',
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ',
      });
    const finalResultWithCount = [];
    if (totalResult) {
      for (const one of totalResult) {
        const threadQuestion = one.toObject();
        // eslint-disable-next-line no-await-in-loop
        const commentsLength = await ThreadAnswerModel.count({
          isDeleted: false,
          activeStatus: true,
          threadId: one._id,
        });
        const eachBody = _.pick(threadQuestion, [
          '_id',
          'activeStatus',
          'threadId',
          'threadQuestion',
          'createdDateTime',
        ]);
        eachBody.commentsLength = commentsLength;
        if (threadQuestion.adminUserId) {
          eachBody.isAdmin = true;
          eachBody.QuestionUserName = threadQuestion.adminUserId.name;
          eachBody.QuestionUserEmail = threadQuestion.adminUserId.email;
        } else if (threadQuestion.userId) {
          eachBody.QuestionUserName = threadQuestion.userId.name;
          eachBody.QuestionUserEmail = threadQuestion.userId.email;
        }

        finalResultWithCount.push(eachBody);
      }
    }
    return res.json({ data: finalResultWithCount });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/community-forum/
// @desc:   get all the non isDeleted community forum item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  try {
    const totalResult = await ThreadAnswerModel.find(filterQuery)
      .populate({
        path: 'threadId',
        match: { isDeleted: false, activeStatus: true },
        select: 'threadQuestion createdDateTime ',
        populate: [
          {
            path: 'adminUserId', // yo chi qn sodhne admin
            match: { isDeleted: false },
            select: ' _id name ',
          },
          {
            path: 'userId', // yo chi qn sodhne client
            match: { isDeleted: false },
            select: ' _id name ',
          },
        ],
      })
      .populate({
        path: 'userId',
        match: { isDeleted: false },
        select: ' _id name ', // yo user chi answer deko client
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ', // yo user chi answer deko admin
      });

    const finalResultWithCount = [];
    if (totalResult) {
      for (const one of totalResult) {
        const threadAnswer = one.toObject();
        const eachBody = _.pick(threadAnswer, [
          '_id',
          'threadAnswer',
          'createdDateTime',
          'activeStatus',
        ]);
        if (threadAnswer.adminUserId) {
          eachBody.answerUsername = threadAnswer.adminUserId.name;
          eachBody.answerEmail = threadAnswer.adminUserId.email;
        } else if (threadAnswer.userId) {
          eachBody.answerUsername = threadAnswer.userId.name;
          eachBody.answerEmail = threadAnswer.userId.email;
        }
        if (threadAnswer.threadId) {
          eachBody.thread_id = threadAnswer.threadId._id;
          eachBody.threadQuestion = threadAnswer.threadId.threadQuestion;
          if (threadAnswer.threadId.adminUserId) {
            eachBody.threadUsername = threadAnswer.threadId.adminUserId.name;
            eachBody.threadEmail = threadAnswer.threadId.adminUserId.email;
          } else if (threadAnswer.threadId.userId) {
            eachBody.threadUsername = threadAnswer.threadId.userId.name;
            eachBody.threadEmail = threadAnswer.threadId.userId.email;
          }
        }

        finalResultWithCount.push(eachBody);
      }
    }
    return res.json({ data: finalResultWithCount });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/community-forum/questionList
// @desc:   get all the non isDeleted community forum question List item
// @access: private
router.get('/questionList', authentication, async (req, res) => {
  try {
    const totalResult = await CommunityForumModel.find({ isDeleted: false })
      .populate({
        path: 'userId',
        match: { isDeleted: false },
        select: ' _id name ',
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ',
      });
    const finalResultWithCount = [];
    if (totalResult) {
      for (const one of totalResult) {
        const eachQuestion = one.toObject();
        const eachBody = _.pick(eachQuestion, [
          '_id',
          'createdDateTime',
          'activeStatus',
        ]);
        eachBody.question = eachQuestion.threadQuestion;

        if (eachQuestion.adminUserId) {
          eachBody.userId = eachQuestion.adminUserId._id;
          eachBody.userName = eachQuestion.adminUserId.name;
          eachBody.answerEmail = eachQuestion.adminUserId.email;
        } else if (eachQuestion.userId) {
          eachBody.userId = eachQuestion.userId._id;
          eachBody.userName = eachQuestion.userId.name;
        }
        finalResultWithCount.push(eachBody);
      }
    }
    return res.json({ data: finalResultWithCount });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  POST api/community-forum/
// @desc:   add or edit a CommunityForum Item
// @access: private (user)
router.post(
  '/',
  auth,
  [check('threadQuestion', 'Thread Question is required').not().isEmpty()],
  validationResult,
  async (req, res) => {
    const itemId = req.body._id;
    const itemBody = _.pick(req.body, ['threadQuestion', 'activeStatus']);
    const userId = req.user._id;
    itemBody[req.user.isAdmin ? 'adminUserId' : 'userId'] = userId;
    itemBody.threadId = randomNumber(10, 200);
    try {
      const existingId = await CommunityForumModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedBy = userId;
        itemBody.updatedDateTime = Date.now();

        const updatedData = await CommunityForumModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated Community Forum question',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Community Forum question' });
      }
      // create

      const modelDoc = new CommunityForumModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Successfully created Community Forum question',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Community Forum question' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  POST api/community-forum/threadAnswer
// @desc:   add or edit a CommunityForum Thread Answer Item
// @access: private (user)
router.post(
  '/threadAnswer',
  auth,
  [check('threadAnswer', 'Thread Answer is required').not().isEmpty()],
  validationResult,
  async (req, res) => {
    const itemId = req.body._id;
    const itemBody = _.pick(req.body, [
      'threadAnswer',
      'threadId',
    ]);

    const userId = req.user._id;

    itemBody.answerId = randomNumber(10, 200);

    try {
      const existingId = itemId && await ThreadAnswerModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedBy = userId;
        itemBody.updatedDateTime = Date.now();

        const updatedData = await ThreadAnswerModel.findByIdAndUpdate(
          existingId._id,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message:
              'Successfully updated Community Forum thread Answer',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Community Forum thread answer' });
      }
      // create
      itemBody[req.user.isAdmin ? 'adminUserId' : 'userId'] = userId;
      const modelDoc = new ThreadAnswerModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        res.json({
          message: 'Successfully created Community Forum thread answer',
          _id: savedData._id,
        });
        // send mail to the user
        if (itemBody.threadId) {
          const threadQuestionClient = await CommunityForumModel.findById(itemBody.threadId)
            .populate('userId', 'email name')
            .populate('adminUserId', 'email name');
          let threadQuestionUser = false;
          if (
            threadQuestionClient
            && threadQuestionClient.userId
            && threadQuestionClient.userId.email
          ) threadQuestionUser = threadQuestionClient.userId;
          else if (
            threadQuestionClient
            && threadQuestionClient.adminUserId
            && threadQuestionClient.adminUserId.email
          ) threadQuestionUser = threadQuestionClient.adminUserId;
          if (threadQuestionUser) {
            return await mailSender({
              to: threadQuestionUser.email,
              subject: communityEmailBodyTemplate.replyAdded.subject(
                req.user.name,
              ),
              html: communityEmailBodyTemplate.replyAdded.html(
                req.user.name,
                threadQuestionUser.name,
                threadQuestionClient._id,
              ),
              text: communityEmailBodyTemplate.replyAdded.text(
                req.user.name,
                threadQuestionUser.name,
                threadQuestionClient._id,
              ),
            });
          }
          return 0;
        }
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Community Forum thread answer' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/community-forum/questionId/<itemId>
// @desc:   get detail of particular forum questions only.
// @access: public
router.get('/thread-question/:itemId', authentication, async (req, res) => {
  try {
    if (req.params.itemId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = ObjectId(req.params.itemId);
    const filterQuery = {
      _id: itemId,
      isDeleted: false,
    };
    if (!req.user.isAdmin) {
      filterQuery.activeStatus = true;
    }
    const item = await CommunityForumModel.findOne(filterQuery)
      .populate({
        path: 'userId',
        match: { isDeleted: false },
        select: ' _id name ',
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ',
      });
    if (item) {
      const threadQuestion = item.toObject();
      const threadQuestionResult = _.pick(threadQuestion, [
        '_id',
        'activeStatus',
        'threadId',
        'threadQuestion',
        'createdDateTime',
      ]);
      if (threadQuestion.adminUserId) {
        threadQuestionResult.isAdmin = true;
        threadQuestionResult.QuestionUserName = threadQuestion.adminUserId.name;
        threadQuestionResult.QuestionUserEmail = threadQuestion.adminUserId.email;
      } else if (threadQuestion.userId) {
        threadQuestionResult.QuestionUserName = threadQuestion.userId.name;
        threadQuestionResult.QuestionUserEmail = threadQuestion.userId.email;
      }
      return res.json({
        data: threadQuestionResult,
      });
    }
    return res.status(404).json({ message: 'No such item exists' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/community-forum/questionId/<itemId>
// @desc:   get the lists of multiple answer of an particular forum from ID.
// @access: public
router.get('/thread-replies/:threadId', authentication, async (req, res) => {
  try {
    if (req.params.threadId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const threadId = ObjectId(req.params.threadId);
    const answerList = await ThreadAnswerModel.find({
      threadId,
      activeStatus: true,
      isDeleted: false,
    })
      .populate({
        path: 'userId',
        match: { isDeleted: false },
        select: ' _id name ',
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ',
      });
    const repliesList = [];
    if (answerList) {
      for (const one of answerList) {
        const threadReply = one.toObject();
        // const commentsLength = await ThreadAnswerModel.count({
        //   isDeleted: false,
        //   activeStatus: true,
        //   threadId: one._id,
        // });
        const eachBody = _.pick(threadReply, [
          '_id',
          'activeStatus',
          'threadId',
          'threadAnswer',
          'createdDateTime',
        ]);
        // eachBody.commentsLength = commentsLength;
        if (threadReply.adminUserId) {
          eachBody.isAdmin = true;
          eachBody.answererName = threadReply.adminUserId.name;
          eachBody.answererEmail = threadReply.adminUserId.email;
        } else if (threadReply.userId) {
          eachBody.answererName = threadReply.userId.name;
          eachBody.answererEmail = threadReply.userId.email;
        }

        repliesList.push(eachBody);
      }
    }
    return res.json({ data: repliesList });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/community-forum/threadId/:id
// @desc:   get  threadAnswer detail from the threadAnswer ID
// @access: private
router.get('/threadId/:id', authentication, async (req, res) => {
  if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
  const itemId = ObjectId(req.params.id);
  try {
    const totalResult = await ThreadAnswerModel.findOne({ _id: itemId })
      .populate({
        path: 'threadId',
        match: { isDeleted: false },
        select: 'threadQuestion createdDateTime ',
        populate: [
          {
            path: 'adminUserId', // yo chi qn sodhne admin
            match: { isDeleted: false },
            select: ' _id name ',
          },
          {
            path: 'userId', // yo chi qn sodhne client
            match: { isDeleted: false },
            select: ' _id name ',
          },
        ],
      })
      .populate({
        path: 'userId',
        match: { isDeleted: false },
        select: ' _id name ', // yo user chi answer deko
      })
      .populate({
        path: 'adminUserId',
        match: { isDeleted: false },
        select: ' _id name ', // yo user chi answer deko
      });
    const data = _.pick(totalResult, [
      '_id',
      'threadAnswer',
    ]);
    if (totalResult.createdDateTime) data.answeredAt = totalResult.createdDateTime;
    if (totalResult.threadId) {
      totalResult.questionId = totalResult.threadId._id;
      totalResult.questionedAt = totalResult.threadId.createdDateTime;
      totalResult.threadQuestion = totalResult.threadId.threadQuestion;
      totalResult.threadId = totalResult.threadId.threadId;
      if (totalResult.threadId && totalResult.threadId.userId) {
        totalResult.userId = totalResult.threadId.userId._id;
        totalResult.questionedUser = totalResult.threadId.userId.name;
      } else if (totalResult.threadId && totalResult.threadId.adminUserId) {
        totalResult.userId = totalResult.threadId.adminUserId._id;
        totalResult.questionedUser = totalResult.threadId.adminUserId.name;
      }
    }
    if (totalResult.userId) {
      totalResult.answeredUserId = totalResult.userId._id;
      totalResult.answeredUserName = totalResult.userId.name;
    } else if (totalResult.adminUserId) {
      totalResult.answeredUserId = totalResult.adminUserId._id;
      totalResult.answeredUserName = totalResult.adminUserId.name;
    }
    return res.json({ data });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  DELETE api/community-forum/many
// @desc:   Delete multiple CommunityForum items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await CommunityForumModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      const updatedAnswerData = await ThreadAnswerModel.updateMany(
        { threadId: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData && updatedAnswerData) {
        res.json({
          message:
            `${updatedData.n} Community forum items are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Community forum items',
        });
      }
    } else res.status(400).json({ message: 'No IDs to delete' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  DELETE api/community-forum/<itemId>
// @desc:   delete single CommunityForum Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await CommunityForumModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    const updatedAnswerData = await ThreadAnswerModel.updateMany(
      { threadId: itemId },
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem && updatedAnswerData) {
      res.json({
        message: `Community forum: ${updatedItem.threadId} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Community forum found from such ID',
      });
    }
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  DELETE api/community-forum/<itemId>
// @desc:   delete single CommunityForum Item [setting isDeleted to false]
// @access: private
router.delete('/thread-reply/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await ThreadAnswerModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );

    if (updatedItem) {
      res.json({
        message: `Community forum Reply: ${updatedItem.answerId} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Community forum Reply found from such ID',
      });
    }
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  DELETE api/community-forum/many
// @desc:   Delete multiple CommunityForum items at once [setting isDeleted to false]
// @access: private
router.post('/thread-reply/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedAnswerData = await ThreadAnswerModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedAnswerData) {
        res.json({
          message:
            `${updatedAnswerData.n} Community forum replies are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Community forum replies',
        });
      }
    } else res.status(400).json({ message: 'No IDs to delete' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});
// @route:  PUT api/community-forum/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of community forum item
// @access: private
router.put('/toggle/:itemId/:toggleStatus', auth, isAdminAuth, async (req, res) => {
  const toggleStatus = req.params.toggleStatus || 'on';
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);

  try {
    if (itemId) {
      const updatedData = await CommunityForumModel.findByIdAndUpdate(
        itemId,
        { activeStatus: toggleStatus.toLowerCase() === 'on' },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message: `Active status of Community Forum: ${updatedData.threadId} has been turned ${toggleStatus}`,
        });
        // send mail to the user
        if (updatedData.userId) {
          const threadQuestionClient = await ClientModel.findById(updatedData.userId);
          await mailSender({
            to: threadQuestionClient.email,
            subject: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].subject(updatedData.threadQuestion),
            html: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].html(
              threadQuestionClient.name,
              updatedData.threadQuestion,
              updatedData
                ._id,
            ),
            text: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].text(updatedData.threadQuestion),
          });
          return 0;
        }
      }
      res.status(400).json({
        message: 'Cannot change active status.',
      });
    } else res.status(404).json({ message: 'No ID to toggle active status' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  PUT api/community-forum/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of community forum item
// @access: private
router.put('/toggle-answer/:itemId/:toggleStatus', auth, isAdminAuth, async (req, res) => {
  const toggleStatus = req.params.toggleStatus || 'on';
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);

  try {
    if (itemId) {
      const updatedData = await ThreadAnswerModel.findByIdAndUpdate(
        itemId,
        { activeStatus: toggleStatus.toLowerCase() === 'on' },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message: `Active status of Thread answer: ${updatedData.answerId} has been turned ${toggleStatus}`,
        });
        // send mail to the user
        if (updatedData.userId) {
          const threadAnswerClient = await ClientModel.findById(updatedData.userId);
          await mailSender({
            to: threadAnswerClient.email,
            subject: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].subject(updatedData.threadAnswer),
            html: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].html(
              threadAnswerClient.name,
              updatedData.threadAnswer,
              updatedData.threadId,
            ),
            text: communityEmailBodyTemplate[
              updatedData.activeStatus ? 'activeStatusOn' : 'activeStatusOff'
            ].text(updatedData.threadAnswer),
          });
          return 0;
        }
      }
      res.status(400).json({
        message: 'Cannot change active status.',
      });
    } else res.status(404).json({ message: 'No ID to toggle active status' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

module.exports = router;
