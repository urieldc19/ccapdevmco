exports.isPriv = (req, res, next) => {
    if(req.session.username !== ''){
        return next();
    } else {
        res.redirect('/');
    }
};

exports.isPub = (req, res, next) => {
    if(req.session.username == ''){
        return next();
    } else {
        res.redirect('/');
    }
};