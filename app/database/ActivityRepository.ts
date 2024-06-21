import { db } from './SQLiteDatabase';

export type Activity = {
    id?: number;
    title: string;
    type: string;
    timeStamp: string;
};

export default class ActivityRepository {
    constructor() {
        this.up();
    }

    public async up() {
        await db.runAsync(
            'CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, timeStamp TEXT);'
        );
    }

    public async clear() {
        await db.runAsync('DELETE FROM activities');
    }

    public async down() {
        await db.runAsync('DROP TABLE activities');
    }

    public async create(activities: Activity) {
        await db.runAsync(
            'INSERT INTO activities (title, type, timeStamp) values (?, ?, ?);',
            [activities.title, activities.type, activities.timeStamp]
        );
    }

    public async all() {
        const result = await db.getAllAsync('SELECT * FROM activities');
        return result;
    }
}
