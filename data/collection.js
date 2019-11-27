//This file establishes the collections to be created in MongoDB
const dbConnection = require("./connection")

const getCollectionFn = collection => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

/*list all the collections here */
module.exports = {
    users: getCollectionFn("users"),
    children: getCollectionFn('children'),
    geofences: getCollectionFn('geofences')
};