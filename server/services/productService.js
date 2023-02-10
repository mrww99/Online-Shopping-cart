const { Pool, Client } = require('pg');

const connectionCredits = {
    user: 'postgres',
    host: 'localhost',
    database: 'zbd-app',
    password: '1111',
    port: 5432
}
class ProductService {
    async fetchProducts(req, res) {
        const userId = req.params.storeId
        let searchQuery
        if (userId === 'no') {
            searchQuery = `SELECT * FROM "product"`;
        } else {
            searchQuery = `SELECT * FROM "product" WHERE store_storeid = ${userId}`;
        }
        try {
            const pool = new Pool(connectionCredits)
            pool.query(searchQuery, (error, result) => {
                if (error) {
                    res.status(401).json({ status: 'error', message: error });
                } else {
                    if (result.rowCount === 0) {
                        res.status(408).send({ error: 'No products found' })
                    } else {
                        res.status(200).json(result.rows)

                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
    async addProduct(req, res) {
        try {
            const storeid = req.params.storeId
            console.log(req.params)
            const client = new Client(connectionCredits);
            const product = req.body.product;
            client.connect();
            const lastIdQuery = `SELECT * FROM "product"`
            const lastInsertedUserIdQuery = await client.query(lastIdQuery)
            const newId = lastInsertedUserIdQuery.rowCount + 1;
            const addAddresQuery = `INSERT INTO "product" (productid, price, color, type, name,store_storeid) VALUES ($1, $2, $3, $4, $5, $6)`;
            await client.query(addAddresQuery, [newId, parseFloat(product.price), product.color, product.type, product.name, storeid])
            console.log(`Product №${newId} to store #${storeid} just has been added`)
            client.end();
            res.send({ status: 'success', message: 'Product added succcessfuly' })
        }
        catch (e) {
            console.log(e)
        }
    }
    async addComment(req, res) {
        const comment = req.body.comment;
        const client = new Client(connectionCredits);
        client.connect();
        const date = comment.date;
        const table = `SELECT * FROM "comment"`
        const lastInsertedUserIdQuery = await client.query(table)
        const newId = lastInsertedUserIdQuery.rowCount + 1;
        const addCommentQuery = `INSERT INTO "comment" (commentid, commentdate, commenttext, user_userid, product_productid) VALUES ($1, $2, $3,$4,$5)`;
        client.query(addCommentQuery, [newId, date, comment.commenttext, comment.user_userid, comment.product_productid])
            .then(() => {
                console.log(`Comment added to product ${comment.product_productid}`);
                res.send({ status: 'success', message: 'Comment added succcessfuly' });
            })
            .catch((error) => {
                console.log(error);
                res.send({ status: 'error', message: 'Error adding comment' });
            })
            .finally(() => {
                client.end();
            });
    }
    async addToCart(req, res) {
        try {
            const client = new Client(connectionCredits);
            client.connect();
            const product = req.body
            const table = `SELECT * FROM "order"`
            const productId = parseInt(product.productId)
            const lastInsertedUserIdQuery = await client.query(table)
            const newId = lastInsertedUserIdQuery.rowCount + 1;
            const i = `SELECT * FROM "order" WHERE "product_productid" = $1`
            const iL = await client.query(i, [productId])
            if (iL.rowCount !== 0) {
                const orderId = iL.rows[0].orderid;
                const quant = iL.rows[0].quantity + 1;
                const price = iL.rows[0].price;
                const updateOrderQuery = 'UPDATE "order" SET quantity = $1, price = $2 WHERE orderid = $3';
                client.query(updateOrderQuery, [quant, price * quant, orderId])
                    .then((e) => {
                        console.log(`Order updated ${orderId}`);
                        res.send({ status: 'success', message: 'Comment added succcessfuly' });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', message: 'Error adding comment' });
                    })
                    .finally(() => {
                        client.end();
                    });
            } else {
                const lastInsertedUserIdQuery = await client.query(table)
                const newId = lastInsertedUserIdQuery.rowCount + 2;
                const addToCartQuery = `INSERT INTO "order" (orderid,
                    addingDate,
                    price,
                    user_userid,
                    product_productid,
                    orderstate,
                    quantity
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
                client.query(addToCartQuery, [newId, product.date, parseFloat(product.price), product.userId, product.productId, 'not paid', 1])
                    .then(() => {
                        console.log(`Order added ${newId}`);
                        res.send({ status: 'success', message: 'Order added succcessfuly' });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', message: 'Error adding order' });
                    })
                    .finally(() => {
                        client.end();
                    });
            }

        } catch (e) {
            console.log(e);
            res.send({ status: 'error', message: e });
        }
    }
    async getComments(req, res) {
        try {
            const productid = req.params.productid;
            const pool = new Pool(connectionCredits)
            pool.query('SELECT c.commenttext, c.commentdate, u."name" AS user_name FROM public."comment" c JOIN public."User" u ON c.user_userid = u.userid WHERE c.product_productid = $1;', [productid], (error, result) => {
                if (error) {
                console.log(error)
                res.status(500).send({ status: 'error', message: `No comment's for this product` })
            } else {
                if (res.rowCount === 0) {
                    res.status(404).send({ error: 'User not found' })
                } else {
                    res.status(200).json(result.rows)
                }
            }
        })
    } catch(error) {
        console.log(error)
    }
}
    async findProduct(req, res) {
    try {
        const productId = req.params.productId;
        const pool = new Pool(connectionCredits)
        pool.query('SELECT product.*, store.name AS store_name FROM "product" JOIN store ON product.store_storeid = store.storeid WHERE productid = $1', [productId], (error, result) => {
            if (error) {
                res.status(500).send(error)
            } else {
                if (result.rowCount === 0) {
                    res.status(404).send({ error: 'Product not found' })
                } else {
                    res.status(200).json(result.rows[0])
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}
    // async findProduct(req, res) {
    //     try {
    //         const productId = req.params.productId;
    //         const pool = new Pool(connectionCredits)
    //         pool.query('SELECT * FROM "product" WHERE productid = $1', [productId], (error, result) => {
    //             if (error) {
    //                 res.status(500).send(error)
    //             } else {
    //                 if (res.rowCount === 0) {
    //                     res.status(404).send({ error: 'User not found' })
    //                 } else {
    //                     res.status(200).json(result.rows[0])
    //                 }
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async deleteProduct(req, res) {
    try {
        const productId = req.params.productId;
        const client = new Client(connectionCredits);
        client.connect();

        // Check if there are any comments related to this product
        const checkCommentsQuery = `SELECT * FROM "comment" WHERE product_productid = $1`;
        const comments = await client.query(checkCommentsQuery, [productId]);

        // If there are comments, delete them first
        if (comments.rowCount > 0) {
            const deleteCommentsQuery = `DELETE FROM "comment" WHERE product_productid = $1`;
            await client.query(deleteCommentsQuery, [productId]);
            console.log(`Comments related to product №${productId} have been deleted`);
        }

        const deleteProductQuery = 'DELETE FROM "product" WHERE productid = $1';
        try {
            await client.query(deleteProductQuery, [productId]);
        } catch (error) {
            res.status(500).send({ error: `Product can't be deleted. It's already been ordered` })
        }

        console.log(`Product №${productId} has been deleted`);
        client.end();
        res.send({ status: 'success', message: 'Product deleted succcessfuly' });
    } catch (e) {
        console.log(e);
    }
}


}

module.exports = new ProductService();