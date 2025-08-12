import cors from "cors";
import express from "express";
import { pool } from "./conexion_db.js";

const app = express();
app.use(cors());
app.use(express.json());

// 1. Total amount paid by each customer
app.get('/total_paid_by_customer', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.customer_name,
                c.identification,
                SUM(b.amount_paid) AS total_paid
            FROM
                billing b
            JOIN
                clients c ON b.id_client = c.id_client
            GROUP BY
                c.id_client, c.customer_name, c.identification
            ORDER BY
                total_paid DESC;
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/pending_invoices', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                b.id_billing,
                c.customer_name,
                c.identification,
                c.phone_number,
                c.email,
                t.id_transaction,
                t.date_time,
                t.transaction_amount,
                b.invoice_amount,
                b.amount_paid,
                COALESCE(b.invoice_amount - b.amount_paid, 0) AS pending_amount
            FROM
                billing b
            JOIN
                clients c ON b.id_client = c.id_client
            JOIN
                transactions t ON b.id_transaction = t.id_transaction
            WHERE
                b.amount_paid < b.invoice_amount
            ORDER BY
                pending_amount DESC;
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 3. List of transactions by platform (e.g., Nequi)
app.get('/transactions_by_platform/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        const result = await pool.query(`
            SELECT
                t.id_transaction,
                t.date_time,
                t.transaction_amount,
                t.state,
                c.customer_name,
                c.identification,
                b.id_billing,
                b.billing_period
            FROM
                transactions t
            JOIN
                billing b ON t.id_transaction = b.id_transaction
            JOIN
                clients c ON b.id_client = c.id_client
            WHERE
                b.used_platform = $1
            ORDER BY
                t.date_time DESC;
        `, [platform]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});


// other for crud 
// Get all customers
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_client, customer_name, identification, address, phone_number, email FROM clients
      ORDER BY customer_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message
    });
  }
});

// 4. Get customer information by ID
app.get('/clients/:id_client', async (req, res) => {
    try {
        const { id_client } = req.params;
        const result = await pool.query(`
            SELECT
                id_client,
                customer_name,
                identification,
                address,
                phone_number,
                email
            FROM
                clients
            WHERE
                id_client = $1
        `, [id_client]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 5. Create a new customer
app.post('/clients', async (req, res) => {
    try {
        const {
            customer_name,
            identification,
            address,
            phone_number,
            email
        } = req.body;
        const result = await pool.query(`
            INSERT INTO clients
            (customer_name, identification, address, phone_number, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_client;
        `, [customer_name, identification, address, phone_number, email]);
        res.status(201).json({
            message: "Customer created successfully",
            id_client: result.rows[0].id_client
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 6. Update customer information
app.put('/clients/:id_client', async (req, res) => {
    try {
        const { id_client } = req.params;
        const {
            customer_name,
            identification,
            address,
            phone_number,
            email
        } = req.body;
        const result = await pool.query(`
            UPDATE clients SET
                customer_name = $1,
                identification = $2,
                address = $3,
                phone_number = $4,
                email = $5
            WHERE
                id_client = $6
        `, [customer_name, identification, address, phone_number, email, id_client]);
        if (result.rowCount > 0) {
            return res.json({ message: "Customer updated" });
        }
        res.status(404).json({ message: "Customer not found" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 7. Delete a customer
app.delete('/clients/:id_client', async (req, res) => {
    try {
        const { id_client } = req.params;
        const result = await pool.query(`
            DELETE FROM clients WHERE id_client = $1
        `, [id_client]);
        if (result.rowCount > 0) {
            return res.json({ message: "Customer deleted" });
        }
        res.status(404).json({ message: "Customer not found" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is ready at http://localhost:3000");
});
