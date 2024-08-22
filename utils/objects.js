const getArticleObject = (article) => {
    return {
        id: article._id,
        title: article.title,
        description: article.description,
        content: article.content,
        createdAt: article.createdAt,
        author: article.author
    };
};


const getUserObject = (user, article) => {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        isActivated: user.isActivated,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
        birthDate: user.birthDate,
        bio: user.bio,
        article: article ? getArticleObject(article) : []
    };
};


module.exports = {
    getArticleObject,
    getUserObject
}