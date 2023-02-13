const { Pool } = require('pg');
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
            const { status } = req.query;
            const userId = req.params.userId;
            let fetchQuery = '';
            if (status === 'unpayed') {
                fetchQuery = `SELECT * FROM "order" WHERE user_userid = ${userId} AND paymentstate = false`;
            } else if (status === 'payed') {
                fetchQuery = `SELECT * FROM "order" WHERE user_userid = ${userId} AND paymentstate = true`;
            } else {
                fetchQuery = `SELECT * FROM "order" WHERE user_userid = ${userId}`;
            }
            let fetchedOrders
            if (status === 'unpayed') {
                fetchedOrders = (await client.query(fetchQuery)).rows[0]
                if(fetchedOrders){
                    const orderid = fetchedOrders.orderid
                    const fetchItemsQuery = `SELECT * FROM orderitem WHERE order_orderid = ${orderid}`
                    const orderItems = await client.query(fetchItemsQuery)
                    res.status(200).json(orderItems.rows)
                }else{
                    res.status(404).json({response:'No unpayed orders found'})
                }
            } else {
                fetchedOrders = (await client.query(fetchQuery)).rows
            }

            // fetchQuery = `SELECT * FROM "order" WHERE user_userid = ${userId} AND paymentstate = false`;
            // const unpayedOrder = await client.query(fetchQuery)
            // if (unpayedOrder.rows.length === 0) {
            //     console.log('No orders yet')
            // }
            // if (status === "payed") {
            //     fetchQuery = `SELECT * FROM order WHERE paymentstate = true AND user_userid = ${userId}`;
            // } else if (status === "unpayed") {
            //     fetchQuery = `SELECT * FROM order WHERE paymentstate = false AND user_userid = ${userId}`;
            // } else {
            //     fetchQuery = `SELECT * FROM order WHERE user_userid = ${userId}`;
            // }
            // const result = client.query(fetchQuery)
            // const orders = result.rows;
            // console.log(orders)
            // // if (orders.length === 0) {
            // //     return res.status(204).send();
            // // } else {
            // //     return res.status(200).json(orders);
            // // }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Error fetching orders" })
        }
        client.release()
    }

}
module.exports = new OrderService();