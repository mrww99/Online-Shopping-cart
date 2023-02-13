const { Client, Pool } = require('pg');
const connectionCredits = {
    user: 'postgres',
    host: 'localhost',
    database: 'zbd-app',
    password: '1111',
    port: 5432
}

class UserService {
    async registration(req, res, next) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const { name, phoneNumber, password } = req.body
            const query = `SELECT * FROM "User" WHERE phonenumber = $1`
            const result = await client.query(query, [phoneNumber]);
            if (result.rows.length > 0) {
                res.status(401).json({ status: 'error', message: 'Phone number already taken' });
                return;
            }
            const table = `SELECT * FROM "store"`
            const lastInsertedUserIdQuery = await client.query(table)
            const newId = lastInsertedUserIdQuery.rowCount + 1;
            const registerQuery = `INSERT INTO "User" (userid, name, phonenumber, password) VALUES ($1, $2, $3, $4)`;
            await client.query(registerQuery, [newId, name, phoneNumber, password])
            console.log(`User №${newId} ${name} just signed up`)
            client.end()
            if (newId !== "undefined") {
                res.cookie('userId', newId, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'strict', secure: false })
            }
            res.send({ status: 'success', message: 'Auth complite succcessfuly' })
        } catch (e) {
            next(e)
        }
    }
    async login(req, res, next) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const { phoneNumber, password } = req.body
            const query = `SELECT * FROM "User" WHERE phonenumber = $1`
            const result = await client.query(query, [phoneNumber])
            const user = result.rows[0]
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Invalid number or password' });
                return;
            }
            else {
                const storedPassword = result.rows[0].password
                if (password !== storedPassword) {
                    res.status(401).json({ status: 'error', message: 'Invalid number or password1' });
                    return;
                }
                const userId = result.rows[0].userid;
                console.log(`User №${userId} ${result.rows[0].name} just logged in`)
                res.cookie('userId', userId, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'strict', secure: false })
                res.send({ status: 'success', message: 'Auth complite succcessfuly' })
            }
            client.end()
        } catch (e) {
            next(e)
        }
    }
    async getAddressList(req, res) {
        try {
            const userId = req.params.userId;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT * FROM address WHERE user_userid = $1', [userId], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    if (res.rowCount === 0) {
                        res.status(200).json({ message: 'No address added yet. Better fix it...' })
                    } else {
                        res.status(200).json(result.rows)
                    }
                }
            })
            pool.end()

        } catch (error) {
            console.log(error)
        }
    }
    async getCardList(req, res) {
        try {
            const userId = req.params.userId;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT * FROM "bank_card" WHERE user_userid = $1', [userId], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    if (res.rowCount === 0) {
                        res.status(200).json({ message: 'No address added yet. Better fix it...' })
                    } else {
                        res.status(200).json(result.rows)
                    }
                }
            })
            pool.end()
        } catch (error) {
            console.log(error)
        }
    }
    async addNewAddress(req, res) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const address = req.body
            const userId = req.params.userId;
            const lastIdQuery = `SELECT * FROM "address" ORDER BY addrid DESC LIMIT 1`
            const lastInsertedUserIdQuery = await client.query(lastIdQuery)
            let lastId;
            if (lastInsertedUserIdQuery.rows[0] == undefined) {
                lastId = 0
            } else {
                lastId = lastInsertedUserIdQuery.rows[0].addrid
            }
            const newId = lastId + 1;
            const addAddresQuery = `INSERT INTO "address" (addrid, city, phonenumber, postalcode,street,province,user_userid, addrestitle) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            await client.query(addAddresQuery, [newId, address[0], address[1], address[2], address[3], address[4], userId, address[5]])
            console.log(`Address №${newId} from user #${userId} just has been added`)
            client.end();
            res.send({ status: 'success', message: 'Addres added succcessfuly' })
        } catch (error) {
            console.log(error)
        }
    }
    async deleteAddress(req, res) {
        const client = new Client(connectionCredits);
        console.log(req.params);
        const card = req.params.addrId[0];
        client.connect();
        const checkUserQuery = 'SELECT * FROM "address" WHERE addrid = $1';
        const pendingCard = await client.query(checkUserQuery, [card])
        console.log(`Address №${card} just has been deleted`)
        const deleteQuery = `DELETE FROM "address" WHERE addrid = ${pendingCard.rows[0].addrid}`
        try {
            await client.query(deleteQuery)
            res.send({ status: 'success', message: 'Card deleted successfuly' })
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
        client.end();
    }
    async deleteCard(req, res) {
        const client = new Client(connectionCredits);
        const card = req.params.cardId[0];
        client.connect();
        const checkUserQuery = 'SELECT * FROM "bank_card" WHERE cardid = $1';
        const pendingCard = await client.query(checkUserQuery, [card])
        const deleteQuery = `DELETE FROM "bank_card" WHERE cardid = ${pendingCard.rows[0].cardid}`
        try {
            await client.query(deleteQuery)
            res.send({ status: 'success', message: 'Card deleted successfuly' })
            client.end();
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
        client.end();
    }
    async addNewCard(req, res) {
        console.log('HERE IT IS')
        try {
            const client = new Client(connectionCredits);
            client.connect(); 
            const cardRaw = req.body 
            const card = {
                cardnumber: cardRaw[0],
                bankid:cardRaw[1].value,
                expiredate:cardRaw[2],
                cardissuer:cardRaw[3].value,
                cardtitle:cardRaw[4],
            }
            console.log(card)
            const userId = req.params.userId;
            const lastIdQuery = `SELECT * FROM "bank_card" ORDER BY cardid DESC LIMIT 1`
            const lastInsertedUserIdQuery = await client.query(lastIdQuery)
            let lastId;
            
            if (lastInsertedUserIdQuery.rows[0] == undefined) {
                lastId = 0
            } else {
                lastId = lastInsertedUserIdQuery.rows[0].cardid
            }
            const newId = lastId + 1;
            const addAddresQuery = `INSERT INTO "bank_card" (cardid, bankid, expiredate, cardissuer,user_userid,cardnumber, cardtitle) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
            await client.query(addAddresQuery, [newId, card.bankid, card.expiredate, card.cardissuer, userId, card.cardnumber, card.cardtitle])
            console.log(`Card №${newId} from user #${userId} just has been added`)
            client.end();
            res.send({ status: 'success', message: 'Addres added succcessfuly' })
        } catch (error) {
            console.log(error)
        }
    }
    async getUser(req, res) {
        try {
            const userId = req.params.userId;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT * FROM "User" WHERE userid = $1', [userId], (error, result) => {
                if (error) {
                    res.status(500).send(error)
                } else {
                    if (res.rowCount === 0) {
                        res.status(404).send({ error: 'User not found' })
                    } else {
                        res.status(200).json(result.rows[0])
                    }
                }
            })
            pool.end()
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserService();