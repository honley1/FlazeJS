const User = require('../models/userModel');
const Article = require('../models/articleModel');

const logger = require('../utils/logger');
const {getUserObject, getArticleObject} = require('../utils/objects');

const uuid = require('uuid');

exports.createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user._id;

        let imagePaths = [];

        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            images.forEach(image => {
                const imageName = uuid.v4() + path.extname(image.name);
                const imagePath = path.resolve(__dirname, '..', 'static', 'images', imageName);
                image.mv(imagePath);
                imagePaths.push(`/static/images/${imageName}`);
            });
        }

        const article = await Article.create({
            title: title,
            content: content,
            author: author,
            images: imagePaths
        });

        logger.info(`New article created: ${title} by user ${author}`);

        return res.status(201).json(article);
    } catch (e) {
        logger.error(e);
        return res.status(400).json({
            status: "bad request",
            code: 400
        });
    }
}