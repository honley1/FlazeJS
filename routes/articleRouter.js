const Router = require('express');
const router = new Router();

const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, articleController.createArticle);

module.exports = router;