const xlsx = require('xlsx');

const expandModels = (models, pricing) => {
    const res = {};
    models.forEach(m => res[m] = pricing);
    return res;
};

const database = {
    cars: {
        Toyota: {
            Innova: ['Petrol', 'Diesel'],
            Fortuner: ['Petrol', 'Diesel'],
            Camry: ['Petrol', 'Hybrid']
        },
        'Maruti Suzuki': {
            Alto: ['Petrol', 'CNG'],
            Swift: ['Petrol', 'CNG'],
            'Wagon R': ['Petrol', 'CNG'],
            Baleno: ['Petrol', 'CNG'],
            Dzire: ['Petrol', 'CNG'],
            Ertiga: ['Petrol', 'CNG', 'Diesel'],
            Brezza: ['Petrol', 'CNG'],
            'Grand Vitara': ['Petrol', 'Hybrid', 'CNG'],
            'S-Presso': ['Petrol', 'CNG'],
            Celerio: ['Petrol', 'CNG'],
            Ignis: ['Petrol'],
            XL6: ['Petrol', 'CNG']
        },
        BMW: {
            '3 Series': ['Petrol', 'Diesel'],
            '5 Series': ['Petrol', 'Diesel'],
            'X5': ['Petrol', 'Diesel']
        },
        'Tata Motors': {
            Nexon: ['Petrol', 'Diesel', 'EV'],
            Altroz: ['Petrol', 'Diesel'],
            Tiago: ['Petrol', 'CNG'],
            Harrier: ['Diesel'],
            Safari: ['Diesel'],
            Punch: ['Petrol', 'CNG']
        },
        Kia: {
            Seltos: ['Petrol', 'Diesel'],
            Sonet: ['Petrol', 'Diesel'],
            Carens: ['Petrol', 'Diesel'],
            Carnival: ['Diesel']
        },
        Volkswagen: {
            Virtus: ['Petrol'],
            Taigun: ['Petrol'],
            Tiguan: ['Petrol'],
            Polo: ['Petrol', 'Diesel']
        },
        Honda: {
            City: ['Petrol', 'Diesel'],
            Amaze: ['Petrol', 'Diesel'],
            Civic: ['Petrol']
        },
        Hyundai: {
            i20: ['Petrol', 'Diesel'],
            Creta: ['Petrol', 'Diesel'],
            Venue: ['Petrol', 'Diesel']
        }
    },
    servicePricing: {
        'Maruti Suzuki': {
            ...expandModels(['Alto', 'S-Presso', 'Celerio'], { service: '₹3,000 – ₹5,000', ac: '₹1,500 – ₹2,500', battery: '₹3,500 – ₹5,500', tyre: '₹12,000 – ₹18,000', dent: '₹2,000 – ₹5,000', windshield: '₹4,000 – ₹8,000', suspension: '₹2,500 – ₹5,000', clutch: '₹4,000 – ₹6,000', body: '₹2,000 – ₹6,000' }),
            ...expandModels(['Swift', 'Wagon R', 'Ignis'], { service: '₹4,000 – ₹7,000', ac: '₹1,500 – ₹3,000', battery: '₹4,500 – ₹7,000', tyre: '₹16,000 – ₹25,000', dent: '₹2,500 – ₹6,000', windshield: '₹5,000 – ₹10,000', suspension: '₹3,000 – ₹6,000', clutch: '₹5,000 – ₹8,000', body: '₹3,000 – ₹7,000' }),
            ...expandModels(['Baleno', 'Dzire'], { service: '₹5,000 – ₹8,000', ac: '₹2,000 – ₹3,500', battery: '₹5,000 – ₹8,000', tyre: '₹18,000 – ₹28,000', dent: '₹3,000 – ₹7,000', windshield: '₹6,000 – ₹12,000', suspension: '₹4,000 – ₹7,000', clutch: '₹6,000 – ₹9,000', body: '₹4,000 – ₹9,000' }),
            ...expandModels(['Ertiga', 'XL6', 'Brezza', 'Grand Vitara'], { service: '₹6,000 – ₹10,000', ac: '₹2,500 – ₹4,000', battery: '₹6,000 – ₹10,000', tyre: '₹22,000 – ₹40,000', dent: '₹4,000 – ₹10,000', windshield: '₹8,000 – ₹18,000', suspension: '₹5,000 – ₹10,000', clutch: '₹7,000 – ₹15,000', body: '₹6,000 – ₹15,000' }),
        },
        'Toyota': {
            'Innova': { service: '₹6,000 – ₹10,000', ac: '₹2,500 – ₹4,500', battery: '₹7,000 – ₹12,000', tyre: '₹25,000 – ₹45,000', dent: '₹4,000 – ₹10,000', windshield: '₹10,000 – ₹20,000', suspension: '₹6,000 – ₹15,000', clutch: '₹10,000 – ₹18,000', body: '₹8,000 – ₹20,000' },
            'Fortuner': { service: '₹12,000 – ₹18,000', ac: '₹3,000 – ₹5,000', battery: '₹10,000 – ₹18,000', tyre: '₹50,000 – ₹90,000', dent: '₹8,000 – ₹20,000', windshield: '₹15,000 – ₹30,000', suspension: '₹12,000 – ₹30,000', clutch: '₹15,000 – ₹30,000', body: '₹15,000 – ₹40,000' },
            'Camry': { service: '₹12,000 – ₹20,000', ac: '₹3,000 – ₹5,000', battery: '₹10,000 – ₹18,000', tyre: '₹40,000 – ₹70,000', dent: '₹8,000 – ₹18,000', windshield: '₹15,000 – ₹25,000', suspension: '₹10,000 – ₹25,000', clutch: '₹15,000 – ₹25,000', body: '₹15,000 – ₹35,000' },
        },
        'BMW': {
            ...expandModels(['3 Series', '5 Series', 'X5'], { service: '₹25,000 – ₹70,000', ac: '₹5,000 – ₹10,000', battery: '₹25,000 – ₹40,000', tyre: '₹60,000 – ₹1,20,000', dent: '₹10,000 – ₹50,000', windshield: '₹25,000 – ₹70,000', suspension: '₹25,000 – ₹1,00,000', clutch: '₹30,000 – ₹70,000', body: '₹25,000 – ₹1,50,000' }),
        },
        'Tata Motors': {
            ...expandModels(['Tiago', 'Punch'], { service: '₹5,000 – ₹8,000', ac: '₹1,500 – ₹3,000', battery: '₹4,000 – ₹7,000', tyre: '₹16,000 – ₹25,000', dent: '₹2,500 – ₹6,000', windshield: '₹5,000 – ₹12,000', suspension: '₹3,000 – ₹7,000', clutch: '₹5,000 – ₹9,000', body: '₹3,000 – ₹8,000' }),
            ...expandModels(['Altroz', 'Nexon'], { service: '₹6,000 – ₹10,000', ac: '₹2,000 – ₹3,500', battery: '₹5,000 – ₹8,000', tyre: '₹20,000 – ₹35,000', dent: '₹3,000 – ₹8,000', windshield: '₹6,000 – ₹15,000', suspension: '₹4,000 – ₹9,000', clutch: '₹6,000 – ₹12,000', body: '₹4,000 – ₹10,000' }),
            ...expandModels(['Harrier', 'Safari'], { service: '₹10,000 – ₹18,000', ac: '₹3,000 – ₹5,000', battery: '₹7,000 – ₹12,000', tyre: '₹35,000 – ₹60,000', dent: '₹5,000 – ₹12,000', windshield: '₹10,000 – ₹20,000', suspension: '₹8,000 – ₹18,000', clutch: '₹10,000 – ₹18,000', body: '₹8,000 – ₹20,000' }),
        },
        'Kia': {
            'Sonet': { service: '₹6,000 – ₹9,000', ac: '₹2,000 – ₹3,500', battery: '₹5,000 – ₹8,000', tyre: '₹18,000 – ₹30,000', dent: '₹3,000 – ₹7,000', windshield: '₹6,000 – ₹15,000', suspension: '₹4,000 – ₹9,000', clutch: '₹6,000 – ₹12,000', body: '₹4,000 – ₹10,000' },
            ...expandModels(['Seltos', 'Carens'], { service: '₹8,000 – ₹12,000', ac: '₹2,500 – ₹4,000', battery: '₹6,000 – ₹10,000', tyre: '₹25,000 – ₹45,000', dent: '₹4,000 – ₹10,000', windshield: '₹8,000 – ₹18,000', suspension: '₹6,000 – ₹12,000', clutch: '₹8,000 – ₹15,000', body: '₹6,000 – ₹15,000' }),
            'Carnival': { service: '₹15,000 – ₹25,000', ac: '₹4,000 – ₹6,000', battery: '₹10,000 – ₹18,000', tyre: '₹50,000 – ₹90,000', dent: '₹8,000 – ₹20,000', windshield: '₹15,000 – ₹30,000', suspension: '₹10,000 – ₹25,000', clutch: '₹15,000 – ₹25,000', body: '₹15,000 – ₹40,000' },
        },
        'Volkswagen': {
            'Polo': { service: '₹6,000 – ₹10,000', ac: '₹2,000 – ₹3,500', battery: '₹5,000 – ₹9,000', tyre: '₹18,000 – ₹30,000', dent: '₹3,000 – ₹8,000', windshield: '₹6,000 – ₹15,000', suspension: '₹5,000 – ₹10,000', clutch: '₹7,000 – ₹14,000', body: '₹5,000 – ₹12,000' },
            ...expandModels(['Virtus', 'Taigun'], { service: '₹8,000 – ₹14,000', ac: '₹2,500 – ₹4,000', battery: '₹6,000 – ₹12,000', tyre: '₹25,000 – ₹45,000', dent: '₹4,000 – ₹10,000', windshield: '₹8,000 – ₹18,000', suspension: '₹6,000 – ₹15,000', clutch: '₹8,000 – ₹18,000', body: '₹6,000 – ₹15,000' }),
            'Tiguan': { service: '₹15,000 – ₹25,000', ac: '₹3,000 – ₹5,000', battery: '₹10,000 – ₹18,000', tyre: '₹45,000 – ₹80,000', dent: '₹6,000 – ₹15,000', windshield: '₹12,000 – ₹25,000', suspension: '₹10,000 – ₹25,000', clutch: '₹12,000 – ₹25,000', body: '₹10,000 – ₹25,000' },
        },
        'Honda': {
            'Amaze': { service: '₹6,000 – ₹9,000', ac: '₹1,500 – ₹3,000', battery: '₹4,500 – ₹7,000', tyre: '₹16,000 – ₹28,000', dent: '₹2,500 – ₹7,000', windshield: '₹5,000 – ₹12,000', suspension: '₹3,500 – ₹8,000', clutch: '₹5,500 – ₹10,000', body: '₹3,500 – ₹9,000' },
            ...expandModels(['City', 'Civic'], { service: '₹8,000 – ₹15,000', ac: '₹2,000 – ₹4,000', battery: '₹6,000 – ₹10,000', tyre: '₹25,000 – ₹45,000', dent: '₹4,000 – ₹10,000', windshield: '₹8,000 – ₹18,000', suspension: '₹5,000 – ₹12,000', clutch: '₹8,000 – ₹15,000', body: '₹6,000 – ₹15,000' }),
        },
        'Hyundai': {
            'i20': { service: '₹5,000 – ₹9,000', ac: '₹1,500 – ₹3,000', battery: '₹4,500 – ₹7,500', tyre: '₹18,000 – ₹30,000', dent: '₹3,000 – ₹7,000', windshield: '₹5,000 – ₹12,000', suspension: '₹3,500 – ₹8,000', clutch: '₹5,500 – ₹10,000', body: '₹3,500 – ₹9,000' },
            'Venue': { service: '₹6,000 – ₹10,000', ac: '₹2,000 – ₹3,500', battery: '₹5,000 – ₹8,000', tyre: '₹20,000 – ₹35,000', dent: '₹3,500 – ₹8,000', windshield: '₹6,000 – ₹15,000', suspension: '₹4,000 – ₹9,000', clutch: '₹6,000 – ₹12,000', body: '₹4,000 – ₹10,000' },
            'Creta': { service: '₹10,000 – ₹15,000', ac: '₹2,500 – ₹4,000', battery: '₹6,000 – ₹10,000', tyre: '₹25,000 – ₹45,000', dent: '₹5,000 – ₹12,000', windshield: '₹10,000 – ₹20,000', suspension: '₹5,000 – ₹12,000', clutch: '₹10,000 – ₹17,000', body: '₹10,000 – ₹20,000' },
        }
    },
    spareParts: {
        'Toyota': {
            'Fortuner': { 'Engine Oil': '₹4,200', 'Oil Filter': '₹850', 'Air Filter': '₹1,200', 'Fuel Filter': '₹2,500', 'Spark Plug': '₹1,800', 'Brake Pads': '₹2,969', 'Brake Disc': '₹4,500', 'Brake Fluid': '₹450', 'Battery': '₹7,051', 'Tyres': '₹14,226', 'Clutch Plates': '₹21,399', 'Coolant': '₹800', 'Head Bulbs': '₹1,200', 'Wiper Blades': '₹596' },
            'Innova': { 'Engine Oil': '₹3,800', 'Oil Filter': '₹750', 'Air Filter': '₹1,100', 'Fuel Filter': '₹2,200', 'Spark Plug': '₹1,600', 'Brake Pads': '₹2,800', 'Brake Disc': '₹4,200', 'Brake Fluid': '₹450', 'Battery': '₹6,800', 'Tyres': '₹8,500', 'Clutch Plates': '₹18,500', 'Coolant': '₹800', 'Head Bulbs': '₹1,100', 'Wiper Blades': '₹550' },
            'Camry': { 'Engine Oil': '₹5,500', 'Oil Filter': '₹1,200', 'Air Filter': '₹1,800', 'Fuel Filter': '₹3,500', 'Spark Plug': '₹2,500', 'Brake Pads': '₹4,500', 'Brake Disc': '₹8,500', 'Brake Fluid': '₹600', 'Battery': '₹12,000', 'Tyres': '₹12,500', 'Clutch Plates': '₹35,000', 'Coolant': '₹1,200', 'Head Bulbs': '₹4,500', 'Wiper Blades': '₹1,200' }
        },
        'Maruti Suzuki': {
            'Swift': { 'Engine Oil': '₹1,800', 'Oil Filter': '₹350', 'Air Filter': '₹450', 'Fuel Filter': '₹1,200', 'Spark Plug': '₹600', 'Brake Pads': '₹1,450', 'Brake Disc': '₹2,800', 'Brake Fluid': '₹350', 'Battery': '₹3,888', 'Tyres': '₹4,430', 'Clutch Plates': '₹6,500', 'Coolant': '₹500', 'Head Bulbs': '₹450', 'Wiper Blades': '₹480' },
            'Alto': { 'Engine Oil': '₹1,200', 'Oil Filter': '₹250', 'Air Filter': '₹350', 'Fuel Filter': '₹800', 'Spark Plug': '₹400', 'Brake Pads': '₹950', 'Brake Disc': '₹1,800', 'Brake Fluid': '₹250', 'Battery': '₹3,200', 'Tyres': '₹2,800', 'Clutch Plates': '₹4,500', 'Coolant': '₹400', 'Head Bulbs': '₹350', 'Wiper Blades': '₹380' },
            'Wagon R': { 'Engine Oil': '₹1,500', 'Oil Filter': '₹300', 'Air Filter': '₹400', 'Fuel Filter': '₹1,000', 'Spark Plug': '₹500', 'Brake Pads': '₹1,200', 'Brake Disc': '₹2,200', 'Brake Fluid': '₹300', 'Battery': '₹3,500', 'Tyres': '₹3,500', 'Clutch Plates': '₹5,500', 'Coolant': '₹450', 'Head Bulbs': '₹400', 'Wiper Blades': '₹420' },
            'Baleno': { 'Engine Oil': '₹2,200', 'Oil Filter': '₹450', 'Air Filter': '₹550', 'Fuel Filter': '₹1,500', 'Spark Plug': '₹800', 'Brake Pads': '₹1,800', 'Brake Disc': '₹3,500', 'Brake Fluid': '₹400', 'Battery': '₹4,500', 'Tyres': '₹5,500', 'Clutch Plates': '₹8,500', 'Coolant': '₹600', 'Head Bulbs': '₹600', 'Wiper Blades': '₹550' },
            'Dzire': { 'Engine Oil': '₹1,900', 'Oil Filter': '₹380', 'Air Filter': '₹480', 'Fuel Filter': '₹1,300', 'Spark Plug': '₹650', 'Brake Pads': '₹1,550', 'Brake Disc': '₹3,000', 'Brake Fluid': '₹380', 'Battery': '₹4,000', 'Tyres': '₹4,800', 'Clutch Plates': '₹7,000', 'Coolant': '₹550', 'Head Bulbs': '₹500', 'Wiper Blades': '₹500' },
            'Ertiga': { 'Engine Oil': '₹2,800', 'Oil Filter': '₹550', 'Air Filter': '₹650', 'Fuel Filter': '₹1,800', 'Spark Plug': '₹1,200', 'Brake Pads': '₹2,200', 'Brake Disc': '₹4,500', 'Brake Fluid': '₹500', 'Battery': '₹5,500', 'Tyres': '₹6,500', 'Clutch Plates': '₹10,500', 'Coolant': '₹750', 'Head Bulbs': '₹850', 'Wiper Blades': '₹650' },
            'Brezza': { 'Engine Oil': '₹2,500', 'Oil Filter': '₹480', 'Air Filter': '₹580', 'Fuel Filter': '₹1,600', 'Spark Plug': '₹1,000', 'Brake Pads': '₹1,900', 'Brake Disc': '₹3,800', 'Brake Fluid': '₹450', 'Battery': '₹5,000', 'Tyres': '₹7,500', 'Clutch Plates': '₹9,500', 'Coolant': '₹650', 'Head Bulbs': '₹750', 'Wiper Blades': '600' },
            'Grand Vitara': { 'Engine Oil': '₹3,200', 'Oil Filter': '₹650', 'Air Filter': '₹850', 'Fuel Filter': '₹2,200', 'Spark Plug': '₹1,500', 'Brake Pads': '₹2,600', 'Brake Disc': '₹5,500', 'Brake Fluid': '₹600', 'Battery': '₹8,000', 'Tyres': '₹9,500', 'Clutch Plates': '₹15,000', 'Coolant': '₹900', 'Head Bulbs': '₹1,500', 'Wiper Blades': '₹850' },
            'S-Presso': { 'Engine Oil': '₹1,300', 'Oil Filter': '₹280', 'Air Filter': '₹380', 'Fuel Filter': '₹850', 'Spark Plug': '₹450', 'Brake Pads': '₹1,000', 'Brake Disc': '₹1,950', 'Brake Fluid': '₹280', 'Battery': '₹3,300', 'Tyres': '₹3,000', 'Clutch Plates': '₹4,800', 'Coolant': '₹420', 'Head Bulbs': '₹380', 'Wiper Blades': '₹400' },
            'Celerio': { 'Engine Oil': '₹1,400', 'Oil Filter': '₹290', 'Air Filter': '₹390', 'Fuel Filter': '₹900', 'Spark Plug': '₹480', 'Brake Pads': '₹1,100', 'Brake Disc': '₹2,100', 'Brake Fluid': '₹290', 'Battery': '₹3,400', 'Tyres': '₹3,200', 'Clutch Plates': '₹5,200', 'Coolant': '₹440', 'Head Bulbs': '₹390', 'Wiper Blades': '₹410' },
            'Ignis': { 'Engine Oil': '₹1,700', 'Oil Filter': '₹320', 'Air Filter': '₹420', 'Fuel Filter': '₹1,100', 'Spark Plug': '₹550', 'Brake Pads': '₹1,300', 'Brake Disc': '₹2,500', 'Brake Fluid': '₹320', 'Battery': '₹3,700', 'Tyres': '₹4,000', 'Clutch Plates': '₹6,000', 'Coolant': '₹480', 'Head Bulbs': '₹420', 'Wiper Blades': '₹450' },
            'XL6': { 'Engine Oil': '₹2,900', 'Oil Filter': '₹580', 'Air Filter': '₹680', 'Fuel Filter': '₹1,900', 'Spark Plug': '₹1,300', 'Brake Pads': '₹2,300', 'Brake Disc': '₹4,800', 'Brake Fluid': '₹550', 'Battery': '₹5,800', 'Tyres': '₹6,800', 'Clutch Plates': '₹11,500', 'Coolant': '₹800', 'Head Bulbs': '₹900', 'Wiper Blades': '₹700' }
        },
        'BMW': {
            '3 Series': { 'Engine Oil': '₹8,500', 'Oil Filter': '₹1,800', 'Air Filter': '₹2,500', 'Fuel Filter': '₹4,500', 'Spark Plug': '₹2,800', 'Brake Pads': '₹8,500', 'Brake Disc': '₹18,000', 'Brake Fluid': '₹1,200', 'Battery': '₹15,299', 'Tyres': '₹12,809', 'Clutch Plates': '₹55,000', 'Coolant': '₹2,500', 'Head Bulbs': '₹12,500', 'Wiper Blades': '₹2,200' },
            '5 Series': { 'Engine Oil': '₹10,500', 'Oil Filter': '₹2,200', 'Air Filter': '₹3,200', 'Fuel Filter': '₹5,500', 'Spark Plug': '₹3,500', 'Brake Pads': '₹12,500', 'Brake Disc': '₹25,000', 'Brake Fluid': '₹1,500', 'Battery': '₹18,500', 'Tyres': '₹18,500', 'Clutch Plates': '₹75,000', 'Coolant': '₹3,000', 'Head Bulbs': '₹18,500', 'Wiper Blades': '₹2,800' },
            'X5': { 'Engine Oil': '₹12,500', 'Oil Filter': '₹2,800', 'Air Filter': '₹4,200', 'Fuel Filter': '₹7,500', 'Spark Plug': '₹4,800', 'Brake Pads': '₹18,500', 'Brake Disc': '₹35,000', 'Brake Fluid': '₹2,000', 'Battery': '₹25,000', 'Tyres': '₹28,500', 'Clutch Plates': '₹1,10,000', 'Coolant': '₹4,500', 'Head Bulbs': '₹25,000', 'Wiper Blades': '₹3,500' }
        },
        'Tata Motors': {
            'Nexon': { 'Engine Oil': '₹2,800', 'Oil Filter': '₹550', 'Air Filter': '₹650', 'Fuel Filter': '₹1,800', 'Spark Plug': '₹800', 'Brake Pads': '₹2,200', 'Brake Disc': '₹4,500', 'Brake Fluid': '₹500', 'Battery': '₹5,500', 'Tyres': '₹6,500', 'Clutch Plates': '₹10,500', 'Coolant': '₹750', 'Head Bulbs': '₹850', 'Wiper Blades': '₹650' },
            'Altroz': { 'Engine Oil': '₹2,600', 'Oil Filter': '₹500', 'Air Filter': '₹600', 'Fuel Filter': '₹1,600', 'Spark Plug': '₹750', 'Brake Pads': '₹1,900', 'Brake Disc': '₹3,800', 'Brake Fluid': '₹450', 'Battery': '₹5,000', 'Tyres': '₹5,500', 'Clutch Plates': '₹9,500', 'Coolant': '₹650', 'Head Bulbs': '₹750', 'Wiper Blades': '₹600' },
            'Tiago': { 'Engine Oil': '₹1,900', 'Oil Filter': '₹380', 'Air Filter': '₹480', 'Fuel Filter': '₹1,200', 'Spark Plug': '₹650', 'Brake Pads': '₹1,550', 'Brake Disc': '₹2,800', 'Brake Fluid': '₹380', 'Battery': '₹4,000', 'Tyres': '₹4,200', 'Clutch Plates': '₹6,500', 'Coolant': '₹500', 'Head Bulbs': '₹500', 'Wiper Blades': '₹480' },
            'Harrier': { 'Engine Oil': '₹4,500', 'Oil Filter': '₹950', 'Air Filter': '₹1,400', 'Fuel Filter': '₹2,800', 'Spark Plug': '₹1,800', 'Brake Pads': '₹3,500', 'Brake Disc': '₹6,500', 'Brake Fluid': '₹600', 'Battery': '₹8,500', 'Tyres': '₹12,500', 'Clutch Plates': '₹18,500', 'Coolant': '₹1,000', 'Head Bulbs': '₹1,800', 'Wiper Blades': '₹850' },
            'Safari': { 'Engine Oil': '₹4,800', 'Oil Filter': '₹1,000', 'Air Filter': '₹1,500', 'Fuel Filter': '₹3,000', 'Spark Plug': '₹1,900', 'Brake Pads': '₹3,800', 'Brake Disc': '₹7,500', 'Brake Fluid': '₹650', 'Battery': '₹9,000', 'Tyres': '₹13,500', 'Clutch Plates': '₹20,000', 'Coolant': '₹1,100', 'Head Bulbs': '₹2,000', 'Wiper Blades': '₹950' },
            'Punch': { 'Engine Oil': '₹1,800', 'Oil Filter': '₹350', 'Air Filter': '₹450', 'Fuel Filter': '₹1,100', 'Spark Plug': '₹600', 'Brake Pads': '₹1,400', 'Brake Disc': '₹2,500', 'Brake Fluid': '₹350', 'Battery': '₹3,800', 'Tyres': '₹4,500', 'Clutch Plates': '₹6,000', 'Coolant': '₹450', 'Head Bulbs': '₹450', 'Wiper Blades': '₹450' }
        },
        'Kia': {
            'Seltos': { 'Engine Oil': '₹3,200', 'Oil Filter': '₹650', 'Air Filter': '₹850', 'Fuel Filter': '₹2,200', 'Spark Plug': '₹1,500', 'Brake Pads': '₹2,600', 'Brake Disc': '₹5,500', 'Brake Fluid': '₹600', 'Battery': '₹8,000', 'Tyres': '₹9,500', 'Clutch Plates': '₹15,000', 'Coolant': '₹900', 'Head Bulbs': '₹1,500', 'Wiper Blades': '₹850' },
            'Sonet': { 'Engine Oil': '₹2,500', 'Oil Filter': '₹480', 'Air Filter': '₹580', 'Fuel Filter': '₹1,600', 'Spark Plug': '₹1,000', 'Brake Pads': '₹1,900', 'Brake Disc': '₹3,800', 'Brake Fluid': '₹450', 'Battery': '₹5,000', 'Tyres': '₹7,500', 'Clutch Plates': '₹9,500', 'Coolant': '₹650', 'Head Bulbs': '₹750', 'Wiper Blades': '600' },
            'Carens': { 'Engine Oil': '₹3,100', 'Oil Filter': '₹600', 'Air Filter': '₹800', 'Fuel Filter': '₹2,100', 'Spark Plug': '₹1,400', 'Brake Pads': '₹2,500', 'Brake Disc': '₹5,200', 'Brake Fluid': '₹550', 'Battery': '₹7,500', 'Tyres': '₹9,000', 'Clutch Plates': '₹14,000', 'Coolant': '₹850', 'Head Bulbs': '₹1,400', 'Wiper Blades': '₹800' },
            'Carnival': { 'Engine Oil': '₹5,500', 'Oil Filter': '₹1,200', 'Air Filter': '₹1,800', 'Fuel Filter': '₹3,500', 'Spark Plug': '₹2,500', 'Brake Pads': '₹4,500', 'Brake Disc': '₹8,500', 'Brake Fluid': '₹700', 'Battery': '₹12,000', 'Tyres': '₹15,000', 'Clutch Plates': '₹30,000', 'Coolant': '₹1,500', 'Head Bulbs': '₹6,000', 'Wiper Blades': '₹1,500' }
        },
        'Volkswagen': {
            'Virtus': { 'Engine Oil': '₹3,800', 'Oil Filter': '₹750', 'Air Filter': '₹1,100', 'Fuel Filter': '₹2,500', 'Spark Plug': '₹1,800', 'Brake Pads': '₹3,200', 'Brake Disc': '₹6,500', 'Brake Fluid': '₹600', 'Battery': '₹7,500', 'Tyres': '₹9,500', 'Clutch Plates': '₹18,500', 'Coolant': '₹1,000', 'Head Bulbs': '₹3,500', 'Wiper Blades': '₹1,200' },
            'Taigun': { 'Engine Oil': '₹3,800', 'Oil Filter': '₹750', 'Air Filter': '₹1,100', 'Fuel Filter': '₹2,500', 'Spark Plug': '₹1,800', 'Brake Pads': '₹3,200', 'Brake Disc': '₹6,500', 'Brake Fluid': '₹600', 'Battery': '₹7,500', 'Tyres': '₹9,500', 'Clutch Plates': '₹18,500', 'Coolant': '₹1,000', 'Head Bulbs': '₹3,500', 'Wiper Blades': '₹1,200' },
            'Tiguan': { 'Engine Oil': '₹5,800', 'Oil Filter': '₹1,500', 'Air Filter': '₹2,200', 'Fuel Filter': '₹4,500', 'Spark Plug': '₹2,800', 'Brake Pads': '₹6,500', 'Brake Disc': '₹12,500', 'Brake Fluid': '₹800', 'Battery': '₹15,000', 'Tyres': '₹18,000', 'Clutch Plates': '₹45,000', 'Coolant': '₹1,800', 'Head Bulbs': '₹12,000', 'Wiper Blades': '₹2,500' },
            'Polo': { 'Engine Oil': '₹3,200', 'Oil Filter': '₹650', 'Air Filter': '₹950', 'Fuel Filter': '₹1,800', 'Spark Plug': '₹1,200', 'Brake Pads': '₹2,500', 'Brake Disc': '₹4,800', 'Brake Fluid': '₹500', 'Battery': '₹6,500', 'Tyres': '₹6,500', 'Clutch Plates': '₹12,500', 'Coolant': '₹800', 'Head Bulbs': '₹1,800', 'Wiper Blades': '₹950' }
        },
        'Honda': {
            'City': { 'Engine Oil': '₹2,800', 'Oil Filter': '₹550', 'Air Filter': '₹650', 'Fuel Filter': '₹1,800', 'Spark Plug': '₹800', 'Brake Pads': '₹2,200', 'Brake Disc': '₹4,500', 'Brake Fluid': '₹500', 'Battery': '₹5,500', 'Tyres': '₹6,500', 'Clutch Plates': '₹10,500', 'Coolant': '₹750', 'Head Bulbs': '₹850', 'Wiper Blades': '₹650' },
            'Amaze': { 'Engine Oil': '₹1,900', 'Oil Filter': '₹380', 'Air Filter': '₹480', 'Fuel Filter': '₹1,200', 'Spark Plug': '₹650', 'Brake Pads': '₹1,550', 'Brake Disc': '₹2,800', 'Brake Fluid': '₹380', 'Battery': '₹4,000', 'Tyres': '₹4,200', 'Clutch Plates': '₹6,500', 'Coolant': '₹500', 'Head Bulbs': '₹500', 'Wiper Blades': '₹480' },
            'Civic': { 'Engine Oil': '₹4,200', 'Oil Filter': '₹850', 'Air Filter': '₹1,200', 'Fuel Filter': '₹2,800', 'Spark Plug': '₹1,800', 'Brake Pads': '₹3,500', 'Brake Disc': '₹6,500', 'Brake Fluid': '₹600', 'Battery': '₹8,500', 'Tyres': '₹10,500', 'Clutch Plates': '₹18,500', 'Coolant': '₹1,000', 'Head Bulbs': '₹3,500', 'Wiper Blades': '₹1,200' }
        },
        'Hyundai': {
            'Creta': { 'Engine Oil': '₹3,200', 'Oil Filter': '₹650', 'Air Filter': '₹850', 'Fuel Filter': '₹2,200', 'Spark Plug': '₹1,500', 'Brake Pads': '₹2,600', 'Brake Disc': '₹5,500', 'Brake Fluid': '₹600', 'Battery': '₹8,000', 'Tyres': '₹9,500', 'Clutch Plates': '₹15,000', 'Coolant': '₹900', 'Head Bulbs': '₹1,500', 'Wiper Blades': '₹850' },
            'i20': { 'Engine Oil': '₹2,200', 'Oil Filter': '₹450', 'Air Filter': '₹550', 'Fuel Filter': '₹1,500', 'Spark Plug': '₹800', 'Brake Pads': '₹1,800', 'Brake Disc': '₹3,500', 'Brake Fluid': '₹400', 'Battery': '₹4,500', 'Tyres': '₹5,500', 'Clutch Plates': '₹8,500', 'Coolant': '₹600', 'Head Bulbs': '₹600', 'Wiper Blades': '₹550' },
            'Venue': { 'Engine Oil': '₹2,500', 'Oil Filter': '₹480', 'Air Filter': '₹580', 'Fuel Filter': '₹1,600', 'Spark Plug': '₹1,000', 'Brake Pads': '₹1,900', 'Brake Disc': '₹3,800', 'Brake Fluid': '₹450', 'Battery': '₹5,000', 'Tyres': '₹7,500', 'Clutch Plates': '₹9,500', 'Coolant': '₹650', 'Head Bulbs': '₹750', 'Wiper Blades': '600' }
        }
    }
};

// Flatten to Arrays for Excel Rows
const carsRows = [];
const fuelRows = [];
const pricingRows = [];
const spareRows = [];

for (const brand in database.cars) {
    for (const model in database.cars[brand]) {
        carsRows.push({ Brand: brand, Model: model });
        
        const fuels = database.cars[brand][model];
        fuels.forEach(f => fuelRows.push({ Brand: brand, Model: model, Fuel: f }));
        
        const pricing = database.servicePricing[brand]?.[model];
        if (pricing) {
            for (const service in pricing) {
                pricingRows.push({ Brand: brand, Model: model, Service: service, PriceRange: pricing[service] });
            }
        }
        
        const spares = database.spareParts[brand]?.[model];
        if (spares) {
            for (const part in spares) {
                spareRows.push({ Brand: brand, Model: model, Part: part, Price: spares[part] });
            }
        }
    }
}

// Initial Empty Data
const bookingRows = [];
const reviewRows = [];

const wb = xlsx.utils.book_new();

const wsCars = xlsx.utils.json_to_sheet(carsRows);
xlsx.utils.book_append_sheet(wb, wsCars, "Cars");

const wsFuels = xlsx.utils.json_to_sheet(fuelRows);
xlsx.utils.book_append_sheet(wb, wsFuels, "FuelTypes");

const wsPricing = xlsx.utils.json_to_sheet(pricingRows);
xlsx.utils.book_append_sheet(wb, wsPricing, "ServicePricing");

const wsSpares = xlsx.utils.json_to_sheet(spareRows);
xlsx.utils.book_append_sheet(wb, wsSpares, "SpareParts");

const wsBookings = xlsx.utils.json_to_sheet(bookingRows);
// add header to empty sheet
xlsx.utils.sheet_add_aoa(wsBookings, [["OrderID", "CustomerName", "Phone", "Email", "City", "PIN", "PaymentMethod", "CarBrand", "CarModel", "CarFuel", "TotalAmount", "OrderDate"]], { origin: "A1" });
xlsx.utils.book_append_sheet(wb, wsBookings, "Bookings");

const wsReviews = xlsx.utils.json_to_sheet(reviewRows);
xlsx.utils.sheet_add_aoa(wsReviews, [["ReviewID", "CustomerName", "Rating", "ReviewText", "Date"]], { origin: "A1" });
xlsx.utils.book_append_sheet(wb, wsReviews, "Reviews");

xlsx.writeFile(wb, "database.xlsx");
console.log("Created database.xlsx successfully.");
