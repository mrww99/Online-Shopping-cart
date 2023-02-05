const { Client, Pool } = require('pg');

const connectionCredits = {
    user: 'postgres',
    host: 'localhost',
    database: 'zbd-app',
    password: '1111',
    port: 5432
}

class StoreService {
    async getStoreList(req, res) {
        const userId = req.params.userId
        let searchQuery
        if (userId === 'no') {
            searchQuery = `SELECT * FROM "store"`;
        } else {
            searchQuery = `SELECT * FROM "store" WHERE user_userid = ${userId}`;
        }
        try {
            const pool = new Pool(connectionCredits)
            pool.query(searchQuery, (error, result) => {
                if (error) {
                    res.status(401).json({ status: 'error', message: error });
                } else {
                    if (result.rowCount === 0) {
                        res.status(401).send({ error: 'No stores found' })
                    } else {
                        res.status(200).json(result.rows)
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
    async getOrder(req, res) {
        try {
            const userId = req.params.userId;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT * FROM "order" WHERE user_userid = $1', [userId], (error, result) => {
                if (error) {
                    res.status(500).send(error)
                } else {
                    if (result.rowCount === 0) {
                        res.status(404).send({ error: 'No orders yet' })
                    } else {
                        res.status(200).json(result.rows)
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async deleteOrder(req, res) {
        try {
            const client = new Client(connectionCredits);
            const orderId = req.params.orderId
            client.connect();
            if (orderId !== undefined) {
                const updateOrderQuery = 'DELETE FROM "order" WHERE orderid = $1';
                const deleteOrderQuery = 'DELETE FROM "order" WHERE orderid = $1';
                await client.query(deleteOrderQuery, [orderId]);
                console.log(`Order №${orderId} has been deleted`);
                client.end();
                res.send({ status: 'success', message: 'Order deleted succcessfuly' });
            }

        } catch (error) {
            console.log(error)
        }
    }
    async addPaymentInfo(req, res) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const paymentinfo = req.params.paymentInfo
            if (paymentinfo[0] !== undefined && paymentinfo[1]) {
                const updateOrderQuery = 'UPDATE "order" SET orderstate = $1 WHERE orderid = $2';
                client.query(updateOrderQuery, [paymentinfo[2], paymentinfo[0]])
                    .then((e) => {
                        console.log(`Order updated ${paymentinfo[0]}`);
                        res.send({ status: 'success', message: 'Payment succcessfuly' });
                    })
                    .catch((error) => {
                        res.send({ status: 'error', message: 'Error adding payment' });
                    })
                    .finally(() => {
                        client.end();
                    });
            }
        } catch (error) {
            console.log(error)
        }
    }
    async getStore(req, res) {
        try {
            const storeid = req.params.storeId;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT * FROM "store" WHERE storeid = $1', [storeid], (error, result) => {
                if (error) {
                    res.status(500).send(error)
                } else {
                    if (res.rowCount === 0) {
                        res.status(404).send({ error: 'Store not found' })
                    } else {
                        console.log(result)
                        res.status(200).json(result.rows[0])
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async deleteStore(req, res) {
        try {
            const storeid = req.params.storeId;
            const client = new Client(connectionCredits);
            client.connect();
            // Check if there are any comments related to this product
            const checkCommentsQuery = `SELECT * FROM "product" WHERE store_storeid = $1`;
            const products = await client.query(checkCommentsQuery, [storeid]);
            // If there are comments, delete them first
            let i = 0
            if (products.rowCount > 0) {
                const productId = products.rows[0].productid
                const checkCommentsQuery = `SELECT * FROM "comment" WHERE product_productid = $1`;
                const comments = await client.query(checkCommentsQuery, [productId]);
                console.log('HERE ' +storeid)
                if (comments.rowCount > 0) {
                    const deleteCommentsQuery = `DELETE FROM "comment" WHERE product_productid = $1`;
                    await client.query(deleteCommentsQuery, [productId]);
                    console.log(`Comments related to product №${productId} have been deleted`);
                }
                const deleteCommentsQuery = `DELETE FROM "product" WHERE store_storeid = $1`;
                try {
                    await client.query(deleteCommentsQuery, [storeid]);
                    console.log(`Product related to store №${storeid} have been deleted`);
                } catch (error) {
                    res.status(500).send({ error: `You can not delete this store. Somebody already ordered something from it. Don't run away from responsibility` })
                    res.send({ status: 'error' });
                }
            }
            const deleteProductQuery = 'DELETE FROM "store" WHERE storeid = $1';
            await client.query(deleteProductQuery, [storeid]);
            console.log(`Product №${productId} has been deleted`);
            client.end();
            res.send({ status: 'success', message: 'Product deleted succcessfuly' });
        } catch (error) {
            console.log(error)
        }
    }
    async createStore(req, res) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const store = req.body.store
            const userId = req.params.userId
            const table = `SELECT * FROM "store"`
            const lastInsertedUserIdQuery = await client.query(table)
            const newId = lastInsertedUserIdQuery.rowCount + 1;
            const addAddresQuery = `INSERT INTO "store" (storeid, name, user_userid, address_addrid,description) VALUES ($1, $2, $3, $4, $5)`;
            let i = false;
            try {
                await client.query(addAddresQuery, [newId, store.name, userId, store.addrId, store.description])
                i = !i
            } catch (error) {
                if (error.code === '23505') {
                    res.send({ status: 'error', message: 'You already have store' })
                }
            }
            if (i) {
                console.log(`Store №${newId} from user #${userId} just has been created`)
                res.send({ status: 'success', message: 'Store created succcessfuly' })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new StoreService();