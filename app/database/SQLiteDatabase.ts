import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("database.sqlite");
export const executeTransaction = (
  sql: string,
  values?: (string | number | null)[]
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        values,
        (_, resultSet) => {
          resolve(resultSet);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
