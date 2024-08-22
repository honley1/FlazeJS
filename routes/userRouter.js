const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);
router.get('/users', authMiddleware, userController.getAllUser);
router.get('/:username', authMiddleware, userController.getUserByUsername);
router.get('/activate/:link', userController.activate);
router.put('/', authMiddleware, userController.updateUser);

module.exports = router;