CREATE TABLE payslips (
    id SERIAL PRIMARY KEY,
    emp_name VARCHAR(255) NOT NULL,
    emp_code VARCHAR(7) NOT NULL,
    emp_type VARCHAR(50) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    pan VARCHAR(10) NOT NULL,
    account_no VARCHAR(18) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    doj DATE NOT NULL,
    payslip_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_days INTEGER NOT NULL,
    working_days INTEGER NOT NULL,
    days_attended INTEGER NOT NULL,
    lop_days INTEGER NOT NULL,
    arrear_days INTEGER NOT NULL,
    pf_number VARCHAR(13),
    esic_number VARCHAR(17),
    uan_number VARCHAR(12),
    basic_salary DECIMAL(10,2) NOT NULL,
    hra DECIMAL(10,2) NOT NULL,
    education_allowance DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) NOT NULL,
    other_allowance DECIMAL(10,2) NOT NULL,
    professional_tax DECIMAL(10,2) NOT NULL,
    labour_welfare DECIMAL(10,2) NOT NULL,
    gross_pay DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) NOT NULL,
    net_pay DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_payslips_emp_code_month ON payslips (emp_code, payslip_month);
