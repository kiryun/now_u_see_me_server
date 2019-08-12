const app = require('../app/app');
const port = 3000;
const syncDatabase = require('./sync-database');

app.listen(port, () => {
    console.log('now_u_see_me app litensing on port 3000');

    syncDatabase().then(() => {
        console.log("Database sync");
    });
});