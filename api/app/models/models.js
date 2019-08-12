const config = require('../config/environment');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password, {
        host: 'localhost',
        dialect: 'mysql'
    }
);

const User = sequelize.define('user', {
    name: Sequelize.STRING
});

const Media = sequelize.define('media', {
    eventTime: Sequelize.STRING,
    type: Sequelize.INTEGER, // 0: fresh, 1: unknown
    //images address max 7
    img0_addr: Sequelize.STRING,
    img1_addr: Sequelize.STRING,
    img2_addr: Sequelize.STRING,
    img3_addr: Sequelize.STRING,
    img4_addr: Sequelize.STRING,
    img5_addr: Sequelize.STRING,
    img6_addr: Sequelize.STRING
});

module.exports = {
    sequelize: sequelize,
    User: User,
    Media: Media
}