const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.xlsx');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from current directory
app.use(express.static(__dirname));

// Function to read a specific sheet from Excel
function readSheet(sheetName) {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        const workbook = xlsx.readFile(DB_FILE);
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return [];
        return xlsx.utils.sheet_to_json(sheet);
    } catch (err) {
        console.error("Error reading Excel file:", err);
        return [];
    }
}

// Function to append a row to a specific sheet
function appendRow(sheetName, rowData) {
    let workbook;
    if (fs.existsSync(DB_FILE)) {
        workbook = xlsx.readFile(DB_FILE);
    } else {
        workbook = xlsx.utils.book_new();
    }

    let worksheet = workbook.Sheets[sheetName];
    let data = [];
    if (worksheet) {
        data = xlsx.utils.sheet_to_json(worksheet);
    }
    
    data.push(rowData);
    
    // Convert back to worksheet
    const newWorksheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;
    
    // If sheet didn't exist, we must append it
    if (!worksheet) {
        xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName);
    }

    xlsx.writeFile(workbook, DB_FILE);
}

// API: Get States and Districts (We keep this mock or static since Excel is mostly for Cars/Orders)
const locations = {
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Erode', 'Tirupur', 'Karur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Agra', 'Varanasi']
};

app.get('/api/locations', (req, res) => {
    res.json(locations);
});

// API: Get All Cars
app.get('/api/cars', (req, res) => {
    const carsData = readSheet('Cars');
    const grouped = {};
    carsData.forEach(row => {
        if (!grouped[row.Brand]) grouped[row.Brand] = [];
        if (!grouped[row.Brand].includes(row.Model)) grouped[row.Brand].push(row.Model);
    });
    res.json(grouped);
});

// API: Get Fuel Types for a specific car
app.get('/api/cars/fuels', (req, res) => {
    const { brand, model } = req.query;
    const fuelsData = readSheet('FuelTypes');
    const fuels = fuelsData
        .filter(row => row.Brand === brand && row.Model === model)
        .map(row => row.Fuel);
    res.json(fuels);
});

// API: Get Service Pricing
app.get('/api/pricing', (req, res) => {
    const { brand, model } = req.query;
    const pricingData = readSheet('ServicePricing');
    const pricing = {};
    pricingData
        .filter(row => row.Brand === brand && row.Model === model)
        .forEach(row => {
            pricing[row.Service] = row.PriceRange;
        });
    res.json(pricing);
});

// API: Get Spare Parts Pricing
app.get('/api/spares', (req, res) => {
    const { brand, model } = req.query;
    const sparesData = readSheet('SpareParts');
    const spares = {};
    sparesData
        .filter(row => row.Brand === brand && row.Model === model)
        .forEach(row => {
            spares[row.Part] = row.Price;
        });
    res.json(spares);
});

// API: Submit Booking
app.post('/api/bookings', (req, res) => {
    const data = req.body;
    const orderId = 'ORD' + Date.now();
    const row = {
        OrderID: orderId,
        CustomerName: data.name || '',
        Phone: data.phone || '',
        Email: data.email || '',
        City: data.city || '',
        PIN: data.pin || '',
        PaymentMethod: data.paymentMethod || '',
        CarBrand: data.carBrand || '',
        CarModel: data.carModel || '',
        CarFuel: data.carFuel || '',
        TotalAmount: data.totalAmount || '',
        OrderDate: new Date().toISOString()
    };
    
    appendRow('Bookings', row);
    res.json({ success: true, orderId: orderId });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server.');
});
