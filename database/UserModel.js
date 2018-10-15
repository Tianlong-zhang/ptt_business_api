var Sequelize = require('sequelize');
var sequelize = require('./Model');

// 创建 model
var User = sequelize.define('user', {
    address: {
        type: Sequelize.STRING
    },
    nickname: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
}, {
    freezeTableName: false
});

User.sync({ force: false });

exports.addUser = function(address) {
    return User.create({
        address: address,
    });
};
 
exports.findAddress = function(address) {
    return User.findOne({ 
        where: { 
            address: address 
        } 
    });
};
