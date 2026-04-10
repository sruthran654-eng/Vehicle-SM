document.addEventListener('DOMContentLoaded', () => {
    // Helper for expanding models
    const expandModels = (models, pricing) => {
        const res = {};
        models.forEach(m => res[m] = pricing);
        return res;
    };

    // --- API Service connected to Excel Backend ---
    const GoMechanicAPI = {
        database: { cars: {}, servicePricing: {}, spareParts: {} },
        
        async getStates() {
            try {
                const res = await fetch('/api/locations');
                const locs = await res.json();
                this.locations = locs;
                return Object.keys(locs);
            } catch(e) { console.error(e); return []; }
        },
        async getDistricts(state) {
            try {
                if(!this.locations) await this.getStates();
                return this.locations[state] || [];
            } catch(e) { console.error(e); return []; }
        },
        
        async getModels(brand) {
            try {
                const res = await fetch('/api/cars');
                const cars = await res.json();
                this.database.cars = cars;
                return cars[brand] || [];
            } catch(e) { console.error(e); return []; }
        },

        async getFuelTypes(brand, model) {
            try {
                const res = await fetch(`/api/cars/fuels?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`);
                const fuels = await res.json();
                if(!this.database.cars[brand]) this.database.cars[brand] = {};
                this.database.cars[brand][model] = fuels;
                return fuels;
            } catch(e) { console.error(e); return []; }
        },
        
        async fetchPricing(brand, model) {
            try {
                const [resPrice, resSpares] = await Promise.all([
                    fetch(`/api/pricing?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`),
                    fetch(`/api/spares?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`)
                ]);
                const pricing = await resPrice.json();
                const spares = await resSpares.json();
                
                if(!this.database.servicePricing[brand]) this.database.servicePricing[brand] = {};
                this.database.servicePricing[brand][model] = pricing;
                
                if(!this.database.spareParts[brand]) this.database.spareParts[brand] = {};
                this.database.spareParts[brand][model] = spares;
            } catch(e) { console.error("Error fetching pricing", e); }
        }
    };

    // --- DOM Elements ---
    // Location Elements
    const widgetStateSelect = document.getElementById('widgetStateSelect');
    const widgetDistrictSelect = document.getElementById('widgetDistrictSelect');
    const widgetDistrictLoader = document.getElementById('widgetDistrictLoader');
    const widgetConfirmLocationBtn = document.getElementById('widgetConfirmLocationBtn');
    const widgetLocationForm = document.getElementById('widgetLocationForm');
    const locationStepContainer = document.getElementById('locationStepContainer');
    const carStepContainer = document.getElementById('carStepContainer');
    const currentLocationText = document.getElementById('currentLocationText');
    const currentLocationDisplay = document.getElementById('currentLocationDisplay');
    const widgetPhoneInput = document.getElementById('widgetPhoneInput');

    // Search Elements (Removed)
    // const mainSearchInput = document.getElementById('mainSearchInput');
    // const searchSuggestions = document.getElementById('searchSuggestions');

    // Car Elements
    const heroBrand = document.getElementById('heroBrand');
    const heroModel = document.getElementById('heroModel');
    const heroFuel = document.getElementById('heroFuel');
    
    const heroModelLoader = document.getElementById('heroModelLoader');
    const heroFuelLoader = document.getElementById('heroFuelLoader');
    
    const checkPricesBtn = document.getElementById('checkPricesBtn');
    const carSelectorForm = document.getElementById('carSelectorForm');
    
    const toastContainer = document.getElementById('toastContainer');
    
    // --- Utilities ---
    function formatIndianNumber(num) {
        if (isNaN(num)) return num;
        return new Intl.NumberFormat('en-IN').format(num);
    }

    function resetDropdown(selectElement, defaultText) {
        selectElement.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
        selectElement.disabled = true;
    }

    function populateDropdown(selectElement, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    // --- Event Listeners ---
    // Location Widget Logic
    if (widgetStateSelect) {
        GoMechanicAPI.getStates().then(states => {
            populateDropdown(widgetStateSelect, states);
        });

        widgetStateSelect.addEventListener('change', async () => {
            resetDropdown(widgetDistrictSelect, 'Select District');
            widgetConfirmLocationBtn.disabled = true;
            
            const state = widgetStateSelect.value;
            if (!state) return;
            
            widgetDistrictLoader.style.display = 'inline-block';
            const districts = await GoMechanicAPI.getDistricts(state);
            widgetDistrictLoader.style.display = 'none';
            
            populateDropdown(widgetDistrictSelect, districts);
            widgetDistrictSelect.disabled = false;
        });
    }

    if (widgetDistrictSelect) {
        widgetDistrictSelect.addEventListener('change', () => {
            validateLocationForm();
        });
    }

    if (widgetPhoneInput) {
        widgetPhoneInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            validateLocationForm();
        });
        widgetPhoneInput.addEventListener('change', () => {
            validateLocationForm();
        });
    }

    function validateLocationForm() {
        const district = widgetDistrictSelect ? widgetDistrictSelect.value : '';
        const phone = widgetPhoneInput ? widgetPhoneInput.value : '';
        const isValid = district && phone.length === 10;
        
        console.log(`Validating form: District="${district}", Phone="${phone}" (len=${phone.length}) -> isValid=${isValid}`);
        
        if (widgetConfirmLocationBtn) {
            widgetConfirmLocationBtn.disabled = !isValid;
        }
    }

    if (widgetLocationForm) {
        widgetLocationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Location form submitted');
            
            const district = widgetDistrictSelect.value;
            const phone = widgetPhoneInput.value;
            
            if (currentLocationText) currentLocationText.innerText = district;
            
            if (locationStepContainer && carStepContainer) {
                locationStepContainer.style.display = 'none';
                carStepContainer.style.display = 'block';
                console.log('Transitioned to car step');
                // Hide search bar when entering car selection
                const navSearch = document.querySelector('.nav-search');
                if (navSearch) navSearch.classList.remove('search-visible');
            } else {
                console.error('Missing step containers', { locationStepContainer, carStepContainer });
            }
            
            // Removed toast notification on location save as per user request
        });
    }

    if (currentLocationDisplay) {
        currentLocationDisplay.addEventListener('click', () => {
            if (locationStepContainer && carStepContainer) {
                locationStepContainer.style.display = 'block';
                carStepContainer.style.display = 'none';
                // Hide search bar when returning to location selection
                const navSearch = document.querySelector('.nav-search');
                if (navSearch) navSearch.classList.remove('search-visible');
            }
        });
    }

    // --- Search Logic Removed ---

    // Car Selector Logic
    if (heroBrand) {
        heroBrand.addEventListener('change', async () => {
            resetDropdown(heroModel, 'Select Model');
            resetDropdown(heroFuel, 'Select Fuel Type');
            checkPricesBtn.disabled = true;

            const brand = heroBrand.value;
            if (!brand) return;

            heroModelLoader.style.display = 'inline-block';
            const models = await GoMechanicAPI.getModels(brand);
            heroModelLoader.style.display = 'none';

            populateDropdown(heroModel, models);
            heroModel.disabled = false;
        });
    }

    if (heroModel) {
        heroModel.addEventListener('change', async () => {
            resetDropdown(heroFuel, 'Select Fuel Type');
            checkPricesBtn.disabled = true;

            const brand = heroBrand.value;
            const model = heroModel.value;
            if (!model) return;

            heroFuelLoader.style.display = 'inline-block';
            const fuels = await GoMechanicAPI.getFuelTypes(brand, model);
            heroFuelLoader.style.display = 'none';

            populateDropdown(heroFuel, fuels);
            heroFuel.disabled = false;
        });
    }
    
    if (heroFuel) {
        const handleAutomatedUpdate = () => {
            if (heroFuel.value) {
                checkPricesBtn.disabled = false;
                // Automatic display and scroll removed as per user request to use "Check Prices" button
            }
        };

        heroFuel.addEventListener('change', handleAutomatedUpdate);
        heroFuel.addEventListener('input', handleAutomatedUpdate);
    }

    // --- Sections Slider Navigation ---
    const sectionsSlider = document.getElementById('sectionsSlider');
    const goToSparePartsBtn = document.getElementById('goToSpareParts');
    const goToServicesBtn = document.getElementById('goToServices');

    if (goToSparePartsBtn && sectionsSlider) {
        goToSparePartsBtn.addEventListener('click', () => {
            sectionsSlider.style.transform = 'translateX(-50%)';
            // Set dynamic height for the spare parts section
            if (sectionsSlider.children.length > 1) {
                sectionsSlider.style.height = sectionsSlider.children[1].offsetHeight + 'px';
            }
            // Scroll to top of section for better experience
            document.getElementById('sectionsViewport').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (goToServicesBtn && sectionsSlider) {
        goToServicesBtn.addEventListener('click', () => {
            sectionsSlider.style.transform = 'translateX(0)';
            // Set dynamic height for the services section
            if (sectionsSlider.children.length > 0) {
                sectionsSlider.style.height = sectionsSlider.children[0].offsetHeight + 'px';
            }
            // Scroll to top of section for better experience
            document.getElementById('sectionsViewport').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (carSelectorForm) {
        carSelectorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const brand = heroBrand.value;
            const model = heroModel.value;
            const fuel = heroFuel.value;
            
            const btn = document.getElementById('checkPricesBtn');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Fetching Prices...';
            btn.disabled = true;

            // Fetch pricing data before showing the sections
            await GoMechanicAPI.fetchPricing(brand, model);
            
            btn.innerText = originalText;
            btn.disabled = false;
            
            // Show hidden sections container
            const viewport = document.getElementById('sectionsViewport');
            if (viewport) {
                viewport.classList.add('visible');
            }
            
            // Reset slider to first section (Services)
            const slider = document.getElementById('sectionsSlider');
            if (slider) {
                slider.style.transform = 'translateX(0)';
            }

            // Save selected car details to localStorage for checkout
            localStorage.setItem('drivehub_car', JSON.stringify({ brand, model, fuel }));

            // Update UI with vehicle specific pricing
            updateServicePricingUI(brand, model);
            updateSparePartsUI(brand, model);
            
            setTimeout(() => {
                const viewport = document.getElementById('sectionsViewport');
                const sli = document.getElementById('sectionsSlider');
                if (sli && sli.children.length > 0) {
                    sli.style.height = sli.children[0].offsetHeight + 'px';
                }
                if (viewport) {
                    viewport.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    }

    // --- UI Update Logic for Pricing ---
    function updateServicePricingUI(brand, model) {
        const pricing = GoMechanicAPI.database.servicePricing[brand]?.[model];
        const infoBanner = document.getElementById('selectedCarInfo');
        const carNameDisplay = document.getElementById('selectedCarNameDisplay');
        
        if (!pricing) {
            if (infoBanner) infoBanner.style.display = 'none';
            document.querySelectorAll('.service-starting-price').forEach(el => el.style.display = 'none');
            // Search bar removed, so these lines are gone
            return;
        }

        // Search bar removed, so these animation lines are gone

        if (infoBanner) {
            infoBanner.style.display = 'flex';
            carNameDisplay.innerText = `${brand} ${model}`;
        }

        document.querySelectorAll('.service-card').forEach(card => {
            const type = card.getAttribute('data-service');
            const priceEl = card.querySelector('.service-starting-price');
            const priceVal = card.querySelector('.price-val');
            
            if (type && pricing[type]) {
                const minPrice = pricing[type].split(' – ')[0];
                if (priceVal) priceVal.innerText = minPrice;
                if (priceEl) priceEl.style.display = 'block';
            }
        });
    }

    // --- Spare Parts UI Generation ---
    function updateSparePartsUI(brand, model) {
        const sparePartsData = GoMechanicAPI.database.spareParts[brand]?.[model];
        const grid = document.getElementById('sparePartsGrid');

        if (!sparePartsData || !grid) {
            return;
        }

        let html = '';
        const partIcons = {
            'Engine Oil': 'bx-droplet',
            'Oil Filter': 'bx-filter',
            'Air Filter': 'bx-wind',
            'Fuel Filter': 'bx-gas-pump',
            'Spark Plug': 'bx-bolt',
            'Brake Pads': 'bx-stop-circle',
            'Brake Disc': 'bx-disc',
            'Brake Fluid': 'bx-droplet',
            'Battery': 'bxs-car-battery',
            'Tyres': 'bx-disc',
            'Clutch Plates': 'bx-cog',
            'Coolant': 'bx-water',
            'Head Bulbs': 'bx-bulb',
            'Wiper Blades': 'bx-minus'
        };

        Object.entries(sparePartsData).forEach(([part, price]) => {
            html += `
                <div class="service-card spare-part-card" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; text-align: left; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 0.2rem; font-size: 1.1rem;">${part}</h3>
                        <p style="font-size: 0.85rem; margin-bottom: 0;">Genuine spare part.</p>
                    </div>
                    <div class="service-starting-price" style="font-size: 1rem; color: var(--primary); font-weight: 700; margin-right: 1.5rem;">${price}</div>
                    <div class="select-indicator" style="color: var(--text-muted); font-size: 1.5rem; display: flex;"><i class='bx bx-circle'></i></div>
                </div>
            `;
        });

        grid.innerHTML = html;
        
        // Add click events to select/deselect spare parts
        grid.querySelectorAll('.spare-part-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                const indicator = card.querySelector('.select-indicator');
                if (card.classList.contains('selected')) {
                    indicator.innerHTML = "<i class='bx bxs-check-circle'></i>";
                    indicator.style.color = "var(--primary)";
                } else {
                    indicator.innerHTML = "<i class='bx bx-circle'></i>";
                    indicator.style.color = "var(--text-muted)";
                }
                updateCartPanel();
            });
        });
    }

    function updateCartPanel() {
        const grid = document.getElementById('sparePartsGrid');
        const cartPanel = document.getElementById('sparePartsCartPanel');
        const cartList = document.getElementById('cartItemsList');
        const cartCount = document.getElementById('cartItemCount');
        const cartTotal = document.getElementById('cartTotalPrice');
        const bulkBtn = document.getElementById('bulkAddToCartBtn');
        
        if (!grid || !cartPanel) return;

        const selectedCards = grid.querySelectorAll('.spare-part-card.selected');
        
        if (selectedCards.length === 0) {
            cartPanel.style.display = 'none';
            // Update slider height to shrink back
            const sli = document.getElementById('sectionsSlider');
            if (sli && sli.children.length > 1) {
                sli.style.height = sli.children[1].offsetHeight + 'px';
            }
            return;
        }

        cartPanel.style.display = 'flex';
        cartCount.innerText = selectedCards.length;
        
        let html = '';
        let total = 0;

        selectedCards.forEach(card => {
            const name = card.querySelector('h3').innerText;
            const priceStr = card.querySelector('.service-starting-price').innerText;
            const priceNum = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
            total += priceNum;

            html += `
                <div class="cart-item">
                    <div class="cart-item-name">${name}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="cart-item-price">${priceStr}</div>
                        <i class='bx bx-minus-circle remove-item-btn' data-name="${name}" style="color: var(--danger); cursor: pointer; font-size: 1.2rem;" title="Remove Item"></i>
                    </div>
                </div>
            `;
        });

        cartList.innerHTML = html;
        cartTotal.innerText = '₹' + formatIndianNumber(total);
        
        const actionBtns = document.getElementById('cartActionButtons');
        if (actionBtns) {
            actionBtns.style.display = 'flex';
            if (bulkBtn) bulkBtn.innerText = `Checkout (${selectedCards.length})`;
        }

        // Dynamically update slider height because cart panel may exceed grid height
        const sli = document.getElementById('sectionsSlider');
        if (sli && sli.children.length > 1) {
            sli.style.height = sli.children[1].offsetHeight + 'px';
        }
    }

    const serviceToModalId = {
        'service': 'carServiceModal',
        'ac': 'acServiceModal',
        'battery': 'batteryServiceModal',
        'tyre': 'tyreServiceModal',
        'dent': 'dentingServiceModal',
        'windshield': 'windshieldServiceModal',
        'suspension': 'suspensionServiceModal',
        'clutch': 'clutchServiceModal'
    };

    function updateModalPrices(type, brand, model) {
        const pricing = GoMechanicAPI.database.servicePricing[brand]?.[model];
        if (!pricing || !pricing[type]) return;

        const modalId = serviceToModalId[type];
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const priceElements = modal.querySelectorAll('.package-price');
        let priceStr = pricing[type];
        let minPriceMatch = priceStr.match(/₹([0-9,]+)/);

        if (minPriceMatch && priceElements.length > 1) {
            let basePrice = parseInt(minPriceMatch[1].replace(/,/g, ''));
            priceElements.forEach((el, index) => {
                let multiplier = 1;
                if (index === 1) multiplier = 1.25;
                if (index === 2) multiplier = 1.75;
                if (index > 2) multiplier = 1.75 + (index - 2) * 0.25;
                
                let finalPrice = Math.round((basePrice * multiplier) / 10) * 10; // Round to nearest 10
                el.innerText = '₹' + new Intl.NumberFormat('en-IN').format(finalPrice);
            });
        } else {
            priceElements.forEach(el => {
                el.innerText = pricing[type];
            });
        }
        
        const subtitle = modal.querySelector('.modal-header p');
        if (subtitle) {
            subtitle.innerHTML = `Showing accurate pricing for <strong>${brand} ${model}</strong>`;
        }
    }

    // Service Card Clicks
    const carServiceModal = document.getElementById('carServiceModal');
    const closeCarServiceModal = document.getElementById('closeCarServiceModal');
    const acServiceModal = document.getElementById('acServiceModal');
    const closeAcServiceModal = document.getElementById('closeAcServiceModal');
    const batteryServiceModal = document.getElementById('batteryServiceModal');
    const closeBatteryServiceModal = document.getElementById('closeBatteryServiceModal');
    const tyreServiceModal = document.getElementById('tyreServiceModal');
    const closeTyreServiceModal = document.getElementById('closeTyreServiceModal');
    const dentingServiceModal = document.getElementById('dentingServiceModal');
    const closeDentingServiceModal = document.getElementById('closeDentingServiceModal');
    const windshieldServiceModal = document.getElementById('windshieldServiceModal');
    const closeWindshieldServiceModal = document.getElementById('closeWindshieldServiceModal');
    const suspensionServiceModal = document.getElementById('suspensionServiceModal');
    const closeSuspensionServiceModal = document.getElementById('closeSuspensionServiceModal');
    const clutchServiceModal = document.getElementById('clutchServiceModal');
    const closeClutchServiceModal = document.getElementById('closeClutchServiceModal');

    if (closeCarServiceModal) {
        closeCarServiceModal.addEventListener('click', () => {
            carServiceModal.style.display = 'none';
        });
    }

    if (closeAcServiceModal) {
        closeAcServiceModal.addEventListener('click', () => {
            acServiceModal.style.display = 'none';
        });
    }

    if (closeBatteryServiceModal) {
        closeBatteryServiceModal.addEventListener('click', () => {
            batteryServiceModal.style.display = 'none';
        });
    }

    if (closeTyreServiceModal) {
        closeTyreServiceModal.addEventListener('click', () => {
            tyreServiceModal.style.display = 'none';
        });
    }

    if (closeDentingServiceModal) {
        closeDentingServiceModal.addEventListener('click', () => {
            dentingServiceModal.style.display = 'none';
        });
    }

    if (closeWindshieldServiceModal) {
        closeWindshieldServiceModal.addEventListener('click', () => {
            windshieldServiceModal.style.display = 'none';
        });
    }

    if (closeSuspensionServiceModal) {
        closeSuspensionServiceModal.addEventListener('click', () => {
            suspensionServiceModal.style.display = 'none';
        });
    }

    if (closeClutchServiceModal) {
        closeClutchServiceModal.addEventListener('click', () => {
            clutchServiceModal.style.display = 'none';
        });
    }

    // close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === carServiceModal) {
            carServiceModal.style.display = 'none';
        }
        if (e.target === acServiceModal) {
            acServiceModal.style.display = 'none';
        }
        if (e.target === batteryServiceModal) {
            batteryServiceModal.style.display = 'none';
        }
        if (e.target === tyreServiceModal) {
            tyreServiceModal.style.display = 'none';
        }
        if (e.target === dentingServiceModal) {
            dentingServiceModal.style.display = 'none';
        }
        if (e.target === windshieldServiceModal) {
            windshieldServiceModal.style.display = 'none';
        }
        if (e.target === suspensionServiceModal) {
            suspensionServiceModal.style.display = 'none';
        }
        if (e.target === clutchServiceModal) {
            clutchServiceModal.style.display = 'none';
        }
        const appModal = document.getElementById('appointmentModal');
        if (e.target === appModal) {
            appModal.style.display = 'none';
        }
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('h3').innerText;
            
            const brand = heroBrand.value;
            const model = heroModel.value;
            const fuel = heroFuel.value;

            const serviceType = card.getAttribute('data-service');

            if (brand && model && fuel) {
                if (serviceType) {
                    updateModalPrices(serviceType, brand, model);
                }
            }

            if (serviceName.includes('Car Service')) {
                if (carServiceModal) {
                    carServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('AC Service')) {
                if (acServiceModal) {
                    acServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Batteries')) {
                if (batteryServiceModal) {
                    batteryServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Tyres') || serviceName.includes('Wheel')) {
                if (tyreServiceModal) {
                    tyreServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Denting') || serviceName.includes('Painting')) {
                if (dentingServiceModal) {
                    dentingServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Windshield') || serviceName.includes('Light')) {
                if (windshieldServiceModal) {
                    windshieldServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Suspension')) {
                if (suspensionServiceModal) {
                    suspensionServiceModal.style.display = 'flex';
                }
                return;
            }

            if (serviceName.includes('Clutch')) {
                if (clutchServiceModal) {
                    clutchServiceModal.style.display = 'flex';
                }
                return;
            }

            if (brand && model && fuel) {
                showToast(`Adding ${serviceName} to cart for ${brand} ${model}.`, 'success');
            } else {
                showToast(`Please select a car first to book ${serviceName}.`, 'info');
                document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Book Now buttons inside the modals
    document.querySelectorAll('.modal-content .primary-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!heroBrand.value || !heroModel.value || !heroFuel.value) {
                showToast(`Please select a car first to book a package.`, 'info');
                document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth' });
                e.target.closest('.modal-overlay').style.display = 'none';
                return;
            }

            const packageCard = e.target.closest('.package-card');
            const serviceName = packageCard.querySelector('h3').innerText;
            const price = packageCard.querySelector('.package-price').innerText;
            const category = e.target.closest('.modal-content').querySelector('h2').innerText;

            const priceNum = parseInt(price.replace(/[^0-9]/g, '')) || 0;
            
            // Close the current service modal
            e.target.closest('.modal-overlay').style.display = 'none';

            // Open appointment modal
            const appModal = document.getElementById('appointmentModal');
            if (appModal) {
                document.getElementById('appointmentServiceName').innerText = `${category} - ${serviceName}`;
                appModal.style.display = 'flex';
                appModal.style.alignItems = 'center';
                appModal.style.justifyContent = 'center';
            }
        });
    });

    // Appointment Modal Handlers
    const appModal = document.getElementById('appointmentModal');
    const closeAppModal = document.getElementById('closeAppointmentModal');
    const confirmAppBtn = document.getElementById('confirmAppointmentBtn');

    // Initialize Flatpickr for Appointment Date
    const appDateInput = document.getElementById('appointmentDate');
    if (appDateInput) {
        flatpickr(appDateInput, {
            dateFormat: "d-m-Y", /* Sets format to DD-MM-YYYY */
            minDate: "today",
            theme: "dark",
            disableMobile: "true" /* Forces clean UI on all devices */
        });
    }

    if (closeAppModal && appModal) {
        closeAppModal.addEventListener('click', () => {
            appModal.style.display = 'none';
        });
    }

    if (confirmAppBtn && appModal) {
        confirmAppBtn.addEventListener('click', () => {
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const sName = document.getElementById('appointmentServiceName').innerText;

            if (!date || !time) {
                showToast('Please select both a preferred date and time.', 'error');
                return;
            }

            appModal.style.display = 'none';
            
            localStorage.setItem('drivehub_appointment', JSON.stringify({
                service: sName,
                date: date,
                time: time
            }));
            
            window.location.href = 'appointment-success.html';
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'bx-check-circle';
        if (type === 'error') icon = 'bx-error-circle';
        if (type === 'info') icon = 'bx-info-circle';

        toast.innerHTML = `
            <i class='bx ${icon}'></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Animation in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Bulk Add to Cart Event Listener
    const bulkAddToCartBtn = document.getElementById('bulkAddToCartBtn');
    if (bulkAddToCartBtn) {
        bulkAddToCartBtn.addEventListener('click', () => {
            const selectedCards = document.querySelectorAll('.spare-part-card.selected');
            const items = Array.from(selectedCards).map(card => {
                const name = card.querySelector('h3').innerText;
                const priceStr = card.querySelector('.service-starting-price').innerText;
                const priceNum = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
                return { name, priceStr, price: priceNum };
            });
            
            if (items.length > 0) {
                // Save to localStorage
                localStorage.setItem('drivehub_cart', JSON.stringify(items));
                
                // Redirect
                window.location.href = 'checkout.html';
            }
        });
    }

    // Cart Item Removal Delegate
    const cartItemsList = document.getElementById('cartItemsList');
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const nameToRemove = e.target.getAttribute('data-name');
                const grid = document.getElementById('sparePartsGrid');
                if (grid) {
                    const cards = grid.querySelectorAll('.spare-part-card');
                    cards.forEach(card => {
                        if (card.querySelector('h3').innerText === nameToRemove) {
                            card.classList.remove('selected');
                            const indicator = card.querySelector('.select-indicator');
                            if (indicator) {
                                indicator.innerHTML = "<i class='bx bx-circle'></i>";
                                indicator.style.color = "var(--text-muted)";
                            }
                        }
                    });
                    updateCartPanel();
                }
            }
        });
    }

    // Clear All Button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            const grid = document.getElementById('sparePartsGrid');
            if (grid) {
                const selectedCards = grid.querySelectorAll('.spare-part-card.selected');
                selectedCards.forEach(card => {
                    card.classList.remove('selected');
                    const indicator = card.querySelector('.select-indicator');
                    if (indicator) {
                        indicator.innerHTML = "<i class='bx bx-circle'></i>";
                        indicator.style.color = "var(--text-muted)";
                    }
                });
                updateCartPanel();
                showToast('Cart cleared', 'info');
            }
        });
    }

    // Initial validation check (for autocomplete)
    validateLocationForm();
});
