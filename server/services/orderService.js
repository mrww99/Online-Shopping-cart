const {Pool} = require('pg');
const connectionCredits = {
    user: 'postgres',
    host: 'localhost',
    database: 'zbd-app',
    password: '1111',
    port: 5432
}
const pool = new Pool(connectionCredits)
class OrderService {
    async getOrders(req, res) {
        const client = await pool.connect();
        try {
            console.log(req.query)
            // const { orderType } = req.query;
            const userId = req.params.userId;
            let fetchQuery = '';
            fetchQuery = `SELECT * FROM "order" WHERE user_userid = ${userId} AND paymentstate = false`;
            const unpayedOrder = await client.query(fetchQuery)
            
            if (unpayedOrder.rows.length === 0) {
                console.log('No orders yet')
            } else {
                console.log(unpayedOrder.rows)
                res.status(200).json(unpayedOrder.rows)
            }
            // if (orderType === "payed") {
            //     fetchQuery = `SELECT * FROM order WHERE paymentstate = true AND user_userid = ${userId}`;
            // } else if (orderType === "notPayed") {
            //     fetchQuery = `SELECT * FROM order WHERE paymentstate = false AND user_userid = ${userId}`;
            // } else {
            //     fetchQuery = `SELECT * FROM order WHERE user_userid = ${userId}`;
            // }
            // const orders = result.rows;
            // console.log(orders)
            // if (orders.length === 0) {
            //     return res.status(204).send();
            // } else {
            //     return res.status(200).json(orders);
            // }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Error fetching orders" })
        }
        client.release()
    }

}
module.exports = new OrderService();