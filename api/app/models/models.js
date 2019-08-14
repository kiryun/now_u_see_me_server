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
    //types- 0: fresh, 1: unknown, 2: family, 3: friends
    type0: Sequelize.INTEGER,
    type1: Sequelize.INTEGER,
    type2: Sequelize.INTEGER,
    type3: Sequelize.INTEGER,
    type4: Sequelize.INTEGER,
    type5: Sequelize.INTEGER,
    //images address max 6
    img0_addr: Sequelize.STRING,
    img1_addr: Sequelize.STRING,
    img2_addr: Sequelize.STRING,
    img3_addr: Sequelize.STRING,
    img4_addr: Sequelize.STRING,
    img5_addr: Sequelize.STRING
});

module.exports = {
    sequelize: sequelize,
    User: User,
    Media: Media
}