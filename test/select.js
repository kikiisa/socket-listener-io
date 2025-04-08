import { db } from "../connection/index.js";

const fetch = async () => {
    db.query(`SELECT * FROM message_chats`, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(results[0]);
    })
};

fetch();