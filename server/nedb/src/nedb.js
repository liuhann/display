const NeCollection = require('./ne_collection.js');

class NeDB {
    constructor(dbFilePath) {
        this.dbFilePath = dbFilePath;
        this.collections = {};
    }

    /**
     * @override
     */
    getCollections() {
        return Object.keys(this.collections);
    }

    /**
     * @override
     */
    getCollection(name) {
        if (!this.collections[name]) {
            this.collections[name] = new NeCollection(`${this.dbFilePath}.${name}.db`);
        }
        return this.collections[name];
    }
}

module.exports = NeDB;
