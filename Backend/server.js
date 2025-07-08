const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3609;

// PostgreSQL database connection
const pool = new Pool({
    user: 'postgres', 
    host: 'postgres',
    database: 'payslip_db', 
    password: 'admin123', 
    port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Serve the payslip generator HTML
app.get('/payslip_generator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payslip_generator.html'));
});

// Serve the payslip viewer HTML
app.get('/payslip_viewer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payslip_viewer.html'));
});

// API to save payslip data
app.post('/api/payslips', async (req, res) => {
    const {
        empName, empCode, empType, designation, pan, accountNo, bankName, location,
        doj, payslipMonth, totalDays, workingDays, daysAttended, lopDays, arrearDays,
        pfNumber, esicNumber, uanNumber, basicSalary, hra, educationAllowance,
        bonus, otherAllowance, professionalTax, labourWelfare
    } = req.body;

    // Calculate totals
    const grossPay = parseFloat(basicSalary) + parseFloat(hra) + parseFloat(educationAllowance) +
                     parseFloat(bonus) + parseFloat(otherAllowance);
    const totalDeductions = parseFloat(professionalTax) + parseFloat(labourWelfare);
    const netPay = grossPay - totalDeductions;

    try {
        const query = `
            INSERT INTO payslips (
                emp_name, emp_code, emp_type, designation, pan, account_no, bank_name, location,
                doj, payslip_month, total_days, working_days, days_attended, lop_days, arrear_days,
                pf_number, esic_number, uan_number, basic_salary, hra, education_allowance,
                bonus, other_allowance, professional_tax, labour_welfare, gross_pay, total_deductions, net_pay
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
            RETURNING *;
        `;
        const values = [
            empName, empCode, empType, designation, pan, accountNo, bankName, location,
            doj, payslipMonth, totalDays, workingDays, daysAttended, lopDays, arrearDays,
            pfNumber || 'N.A.', esicNumber || 'N.A.', uanNumber || 'N.A.', basicSalary, hra,
            educationAllowance, bonus, otherAllowance, professionalTax, labourWelfare,
            grossPay, totalDeductions, netPay
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Payslip saved successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error saving payslip:', error);
        res.status(500).json({ error: 'Failed to save payslip' });
    }
});

// API to retrieve payslip by employee ID and month
app.get('/api/payslips/:empCode/:month', async (req, res) => {
    const { empCode, month } = req.params;

    try {
        const query = `
            SELECT * FROM payslips
            WHERE emp_code = $1 AND payslip_month = $2;
        `;
        const result = await pool.query(query, [empCode, month]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Payslip not found' });
        }
    } catch (error) {
        console.error('Error retrieving payslip:', error);
        res.status(500).json({ error: 'Failed to retrieve payslip' });
    }
});

// API to retrieve all payslips for an employee
app.get('/api/payslips/:empCode', async (req, res) => {
    const { empCode } = req.params;

    try {
        const query = `
            SELECT * FROM payslips
            WHERE emp_code = $1
            ORDER BY payslip_month DESC;
        `;
        const result = await pool.query(query, [empCode]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving payslips:', error);
        res.status(500).json({ error: 'Failed to retrieve payslips' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://3.85.61.23:${port}`);
});
