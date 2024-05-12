import { executeTransaction } from "./SQLiteDatabase";

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
    await executeTransaction(
      "CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, timeStamp TEXT);"
    );
  }

  public async down() {
    await executeTransaction("DROP TABLE activities");
  }

  public async create(activities: Activity) {
    const result = await executeTransaction(
      "INSERT INTO activities (title, type, timeStamp) values (?, ?, ?);",
      [activities.title, activities.type, activities.timeStamp]
    );
    return result.insertId;
  }

  public async all() {
    const result = await executeTransaction("SELECT * FROM activities");
    return result.rows._array;
  }
}
