const User = require('../models/userModel');
const Article = require('../models/articleModel');

const validateEmail = require('../utils/emailValidation');
const logger = require('../utils/logger');
const {getUserObject} = require('../utils/objects');
const mailService = require('../utils/mailSender');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const generateJwt = (id, email, avatar, username, isActivated, role) => {
    return jwt.sign(
        {id, email, avatar, username, isActivated, role},
        process.env.SECRET_KEY,
        {expiresIn: '48h'}
    )
}

exports.signUp = async (req, res) => {
    try {
        const { username, email, password, birthDate, bio } = req.body;

        const avatar = req.files?.avatar || 'default_avatar.png';

        const usernameAlreadyExist = await User.exists({username: username});
        const emailAlreadyExist = await User.exists({email: email});

        const MIN_PASSWORD_LENGTH = 8;

        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: 'Password is too short' });
        }
        if (usernameAlreadyExist) {
            return res.status(409).json({ message: 'Username already taken' });
        }
        if (emailAlreadyExist) {
            return res.status(409).json({ message: 'Email already taken' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Incorrect email format' });
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();

        let fileName;
        if (avatar !== 'default_avatar.png') {
            fileName = uuid.v4() + ".png";
            avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
        } else {
            fileName = avatar;
        }

        const user = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            avatar: fileName,
            birthDate: birthDate,
            bio: bio,
            activationLink: activationLink,
            isActivated: false
        });
        const article = await Article.findOne({author: username });

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v1/user/activate/${activationLink}`);

        logger.info(`New user created: ${email}`);

        return res.status(200).json(getUserObject(user, article));
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}

exports.signIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({message: 'Incorrect password specified'})
        }
        const token = generateJwt(user._id, user.email, user.username, user.isActivated, user.role);
        return res.status(200).json({token});
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}

exports.activate = async (req, res) => {
    try{
        const activationLink = req.params.link;
        const user = await User.findOne({activationLink: activationLink});

        if (!user) {
            return res.status(400).json({message: 'Incorrect activation link'})
        }
        if (user.status === 'ACTIVE') {
            return res.status(400).json({message: 'Account has already been activated'});
        }
    
        user.status = 'ACTIVE';
        await user.save();

        const article = await Article.findOne({author: user.username});

        return res.status(200).json(getUserObject(user, article));
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}

exports.getUserByUsername = async (req, res) => {
    try {
        const {username} = req.params;

        const user = await User.findOne({username: username});

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const article = await Article.findOne({author: user.username});

        return res.status(200).json(getUserObject(user, article));
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({});

        const articles = await Article.find({});

        const usersWithArticles = users.map(user => {
            const userArticles = articles.filter(article => article.author.toString() === user.username.toString()); 
        
            const userObject = getUserObject(user, userArticles);

            const userWithArticles = {
                ...userObject
            };

            return userWithArticles;
        })

        return res.status(200).json(usersWithArticles);
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, password, birthDate, bio } = req.body;
        
        const updates = {};
        if (email) {
            const emailAlreadyExist = await User.exists({ email: email });
            if (emailAlreadyExist) {
                return res.status(409).json({ message: 'Email already taken' });
            }
            updates.email = email;
        }
        if (password) {
            const MIN_PASSWORD_LENGTH = 8;
            if (password.length < MIN_PASSWORD_LENGTH) {
                return res.status(400).json({ message: 'Password is too short' });
            }
            const hashPassword = await bcrypt.hash(password, 5);
            updates.password = hashPassword;
        }
        if (birthDate) {
            updates.birthDate = birthDate;
        }
        if (bio) {
            updates.bio = bio;
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const article = await Article.findOne({ author: user.username });

        return res.status(200).json(getUserObject(user, article));
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}