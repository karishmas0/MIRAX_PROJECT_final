// --- PROFILE CARD TOGGLE LOGIC ---

function toggleProfile() {
    const profileCard = document.getElementById('profile-card');
    
    // Check karein ki profile card class list mein 'hidden' hai ya nahi
    profileCard.classList.toggle('hidden');

    // Agar card khul raha hai, toh details refresh karein
    if (!profileCard.classList.contains('hidden')) {
        updateProfileDisplay();
    }
}

// --- REFRESH PROFILE DATA ---

function updateProfileDisplay() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loggedInSection = document.getElementById('profile-logged-in');
    const guestSection = document.getElementById('profile-guest');

    if (isLoggedIn) {
        // Logged in view dikhao
        loggedInSection.classList.remove('hidden');
        guestSection.classList.add('hidden');

        // LocalStorage se details nikal kar HTML mein fill karein
        document.getElementById('disp-email').innerText = localStorage.getItem('userEmail') || "Not set";
        document.getElementById('disp-room').innerText = localStorage.getItem('userRoom') || "Not set";
        document.getElementById('disp-roll').innerText = localStorage.getItem('userRoll') || "Not set";
    } else {
        // Guest view dikhao
        loggedInSection.classList.add('hidden');
        guestSection.classList.remove('hidden');
    }
}

// --- LOGOUT LOGIC ---

function logout() {
    // LocalStorage se login status hata do
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoom');
    localStorage.removeItem('userRoll');

    // Page refresh karo taaki sab reset ho jaye
    alert("Logged out successfully!");
    location.reload();
}

// --- SHOW LOGIN FROM PROFILE ---

function showLoginFromProfile() {
    // Profile band karo aur Login box dikhao
    toggleProfile();
    document.getElementById('login-overlay').classList.remove('hidden');
}

// LOGIN BUTTON: Yeh data hamesha ke liye save karega
function handleLogin() {
    const email = document.getElementById('userEmail').value;
    const room = document.getElementById('roomNo').value;
    const roll = document.getElementById('rollNo').value;

    if (email === "" || room === "" || roll === "") {
        document.getElementById('loginError').style.display = "block";
    } else {
        // LOCAL STORAGE: Yeh hamesha ke liye yaad rakhega
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRoom', room); // <-- Yeh missing tha
        localStorage.setItem('userRoll', roll); // <-- Yeh bhi missing tha
        
        document.getElementById('login-overlay').classList.add('hidden');

        // Login hote hi turant profile display ko update karo taaki sahi data dikhe
        updateProfileDisplay();
    }
}

// SKIP BUTTON: Yeh sirf abhi ke liye box hatayega, save nahi karega
function skipLogin() {
    // Sirf class add hogi, koi data save nahi hoga
    document.getElementById('login-overlay').classList.add('hidden');
}

// WINDOW LOAD: Check karega ki kya login pehle ho chuka hai?
window.onload = function() {
    // Agar 'isLoggedIn' true hai, tabhi box hide rahega
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('login-overlay').classList.add('hidden');
    } else {
        // Agar login nahi kiya tha (sirf skip kiya tha), toh box wapas dikhega
        document.getElementById('login-overlay').classList.remove('hidden');
    }
};

// This function runs when the Search button is clicked
function filterFood() {
    const input = document.getElementById('foodSearch');
    const filter = input.value.toLowerCase().trim();
    const cards = document.getElementsByClassName('grid-item');

    // Agar search box khali hai, toh saare main cards dikhao
    if (filter === "") {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = "";
        }
        return;
    }

    // Har card ko loop karein
    for (let i = 0; i < cards.length; i++) {
        const mainName = cards[i].querySelector('.food-name').innerText.toLowerCase();
        
        // 1. Check karein kya Main Name match ho raha hai? (e.g., "Chicken Biryani")
        let isMatch = mainName.includes(filter);

        // 2. Agar main name match nahi hua, toh uske andar ki varieties check karein (e.g., "Hyderabadi")
        if (!isMatch && foodData[mainName]) {
            // foodData array mein dhoondein ki kya koi variety name match ho raha hai
            isMatch = foodData[mainName].some(variety => 
                variety.name.toLowerCase().includes(filter)
            );
        }

        // 3. Display Logic
        if (isMatch) {
            cards[i].style.display = ""; // Show card
        } else {
            cards[i].style.display = "none"; // Hide card
        }
    }
}

// EXTRA: Make search work instantly when typing (without clicking the button)
document.getElementById('foodSearch').addEventListener('keyup', filterFood);

//again
// Backup variable for home view data
let originalCardsHTML = "";

window.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.getElementById('mainGrid');
    if (mainGrid) {
        // Shuruat ka structure save kar lo
        originalCardsHTML = mainGrid.innerHTML;
    }
});

function filterFood() {
    const input = document.getElementById('foodSearch');
    const filter = input.value.toLowerCase().trim();
    const mainGrid = document.getElementById('mainGrid');
    const homeContent = document.getElementById('homepage-content');

    // SCENARIO 1: Agar search box khali hai -> Sab normal kar do
    if (filter === "") {
        if (homeContent) homeContent.classList.remove('hidden-layout'); // Banners wapas dikhao
        mainGrid.innerHTML = originalCardsHTML; // Purane cards wapas lao
        return;
    }

    // SCENARIO 2: User dhoond raha hai -> Banners hide karo aur exact inner items lao
    if (homeContent) {
        homeContent.classList.add('hidden-layout'); // Slider/Banners ko chhupa do
    }

    let searchMatchesHTML = "";

    // Pure foodData ke andar se matching loop chalana
    for (let category in foodData) {
        foodData[category].forEach(item => {
            // Agar hamare database item ke naam mein query hai
            if (item.name.toLowerCase().includes(filter)) {
                searchMatchesHTML += `
                    <div class="classic-food-card">
                        <img src="${item.img}" class="classic-card-img" alt="${item.name}">
                        <div class="classic-card-info">
                            <h3>${item.name}</h3>
                            <p class="classic-card-price">${item.price}</p>
                            <button class="classic-add-btn" onclick="addSearchItemToTray('${item.name}', '${item.price}')">
                                Add to Tray +
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    }

    // Grid ko filter results se badalna
    if (searchMatchesHTML !== "") {
        mainGrid.innerHTML = searchMatchesHTML;
    } else {
        mainGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #666;">
                <h3>Opps! No results found for "${input.value}"</h3>
                <p>Try searching for Chicken, Rice, or Sweets</p>
            </div>
        `;
    }
}

// Typing karte hi automatic result filter ke liye
document.getElementById('foodSearch').addEventListener('input', filterFood);

// Tray Handling function for search results
function addSearchItemToTray(name, price) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        alert(`${name} successfully added to your tray!`);
    } else {
        alert("Please login first to place an order.");
        document.getElementById('login-overlay').classList.remove('hidden');
    }
}

const foodData = {
    "chicken biryani": [
        { name: "Hyderabadi Dum Biryani", price: "₹250", img: "https://www.licious.in/blog/wp-content/uploads/2020/12/Hyderabadi-chicken-Biryani.jpg" },
        { name: "Lucknowi Pukki Biryani", price: "₹280", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80" },
        { name: "Kolkata Biryani", price: "₹240", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80" },
        { name: "Ambur Biryani", price: "₹230", img: "https://www.happyandharried.com/happyandharried.com/wp-content/uploads/2018/06/KOZHIKODAN-CHICKEN-BIRYANI-HAPPYHARRIED.jpg" },
        { name: "Malabar Biryani", price: "₹270", img: "https://www.ruchikrandhap.com/wp-content/uploads/2011/02/Malabar-Biryani_1-500x500.jpeg" },
        { name: "Sindhi Biryani", price: "₹260", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr5L88pc7MVccbjJP-_pZAFTnWr1YX1aKJyg&s" },
        { name: "Donne Biryani", price: "₹220", img: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/cpbq1uck4icuhdqvuwb0" },
        { name: "Dindigul Biryani", price: "₹210", img: "https://bestrecipesofindia.com/wp-content/uploads/2025/03/IMG_3439-scaled.jpg" },
        { name: "Tehari Style Biryani", price: "₹190", img: "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/63dcb97f72df38001c516f0e.jpg" },
        { name: "Mughlai Chicken Biryani", price: "₹300", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNmYrJ6fattD4Jkoo3GRpQWAF2NZGmLzgnyg&s" }
    ],
    "rolls": [
        { name: "Chicken Kathi Roll", price: "₹120", img: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=300&q=80" },
        { name: "Double Egg Roll", price: "₹80", img: "https://gully2gully.in/wp-content/uploads/2021/12/egg-roll.jpg" },
        { name: "Paneer Tikka Roll", price: "₹150", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvPvXxOeQ9b_oLQIUoPt2kQCZWGfmEEk0Q1A&s" },
        { name: "Mutton Seekh Roll", price: "₹200", img: "https://derafarms.com/cdn/shop/files/deraproducts_40.png?v=1717658662" },
        { name: "Veg Spring Roll", price: "₹90", img: "https://revisfoodography.com/wp-content/uploads/2017/01/veg-spring-roll-main-500x375.jpg" },
        { name: "Cheese Corn Roll", price: "₹110", img: "https://maindish.in/wp-content/uploads/2021/04/Cheese_cornsnack.png" },
        { name: "Afghani Chicken Roll", price: "₹160", img: "https://orders.popskitchen.in/storage/2024/09/image-316.png" },
        { name: "Mayo Chicken Roll", price: "₹130", img: "https://i.ndtvimg.com/i/2017-11/wrap_650x400_81510315859.jpg" },
        // { name: "Mushroom Roll", price: "₹140", img: "https://images.unsplash.com/photo-1533630675582-7e0451a94685?auto=format&fit=crop&w=300&q=80" },
        { name: "Paneer kathi roll", price: "₹85", img: "https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1.jpg" }
    ],
    "chicken": [
        { name: "Butter Chicken", price: "₹350", img: "https://i.ytimg.com/vi/8V6Krk8DDuc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALRxXOjEq-kDdC3IkcMtk-9GWd7Q" },
        { name: "Chicken Tikka Masala", price: "₹320", img: "https://www.spicebangla.com/wp-content/uploads/2024/04/chicken-tikka-masala.jpg" },
        { name: "Kadhai Chicken", price: "₹300", img: "https://i.ytimg.com/vi/AJHP0yKqM4Y/maxresdefault.jpg" },
        { name: "Chicken Chettinad Curry", price: "₹340", img: "https://farm8.staticflickr.com/7890/46966041001_2590047365_o_d.jpg" },
        { name: "Chicken Afgani", price: "₹340", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80" },
        { name: "Chicken 65", price: "₹220", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08kOwpvw1hBL_vChE5ywSQd8klVGzRyPcZg&s" },
        { name: "Chicken Lollipop", price: "₹240", img: "https://www.cafegoldenfeast.com/wp-content/uploads/2025/01/Chicken-Lollipop.jpg" },
        { name: "Lemon Chicken", price: "₹280", img: "https://www.simplyrecipes.com/thmb/q8czZw9Av8VIegAoYn-VNfOsvMc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Lemon-Chicken-LEAD-1-d76dc76d257b456d9cbdddd565fa6c25.jpg" },
        { name: "Chicken Do Pyaza", price: "₹290", img: "https://maunikagowardhan.co.uk/wp-content/uploads/2017/12/IMG_9563-scaled.jpg" },
        { name: "Tandoori Chicken", price: "₹450", img: "https://www.kitchensanctuary.com/wp-content/uploads/2025/07/Tandoori-Chicken-Square-FS.jpg" }
    ],
    "paneer": [
        { name: "Paneer Butter Masala", price: "₹240", img: "https://vegecravings.com/wp-content/uploads/2017/04/paneer-butter-masala-recipe-step-by-step-instructions.jpg" },
        { name: "Shahi Paneer", price: "₹260", img: "https://www.oetker.in/assets/recipes/assets/6c0ac2f3ce204d3d9bb1df9709fc06c9/1272x764/shahi-paneer.webp" },
        { name: "Matar Paneer", price: "₹200", img: "https://static.toiimg.com/thumb/53251884.cms?imgsize=530171&width=800&height=800" },
        { name: "Palak Paneer", price: "₹220", img: "https://midwaytreatmangawan.com/wp-content/uploads/2020/03/Palak-paneer.jpg" },
        { name: "Kadhai Paneer", price: "₹250", img: "https://images.slurrp.com/prod/recipe_images/cms/2wwlfheg0bj.webp" },
        { name: "Paneer Tikka", price: "₹230", img: "https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg" },
        { name: "Paneer Do Pyaza", price: "₹240", img: "https://static.toiimg.com/thumb/59628941.cms?width=1200&height=900" },
        { name: "Paneer Pasanda", price: "₹280", img: "https://www.cookinwithmima.com/wp-content/uploads/2023/07/how-to-cook-paneer-pasanda-500x500.jpg" },
        { name: "Paneer Malai Kofta", price: "₹270", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsT8TUD-NzEQeESGXCTvbEFMbcMp-heDW-Kw&s" },
        { name: "Dum handi paneer ", price: "₹250", img: "https://i.ytimg.com/vi/WQ5Da8QuNmk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC_aO6w1h060f2Rodbp__wvsp-FWA" }
    ],
    "desserts": [
        { name: "Gulab Jamun (2 pcs)", price: "₹50", img: "https://133309359.cdn6.editmysite.com/uploads/1/3/3/3/133309359/VUGI5REHBAQJFGIYDDLJFXMQ.png" },
        { name: "Rasmalai (2 pcs)", price: "₹80", img: "https://cdn.dotpe.in/longtail/store-items/5661665/O2KRz1B8.jpeg" },
        { name: "Gajar Ka Halwa", price: "₹100", img: "https://vanitascorner.com/wp-content/uploads/2018/01/carrothalwa.jpg" },
        { name: "Chocolate Brownie", price: "₹120", img: "https://www.oetker.in/assets/recipes/assets/9a89b75f976642dcab8ae407e2f4344e/750x910/chocolate-brownie.webp" },
        { name: "Vanilla Ice Cream", price: "₹60", img: "https://www.foodandwine.com/thmb/QnTrAIt3aY1g4ToQEk-jULmKMsQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vanilla-ice-cream-FT-RECIPE0324-cebca493f53c4431a0049ea65bfb4796.jpg" },
        { name: "Kulfi Falooda", price: "₹90", img: "https://img-cdn.publive.online/fit-in/1200x675/sanjeev-kapoor/media/post_banners/58bd6f53ff3cb1747031ed71bfe79c216bda4ac7d4bf4060bafe31f84cb72ea9.jpg" },
        { name: "Moong Dal Halwa", price: "₹110", img: "https://rakskitchen.net/wp-content/uploads/2020/11/moong-dal-halwa.jpg" },
        { name: "Cheesecake Slice", price: "₹180", img: "https://cakesbymk.com/wp-content/uploads/2023/11/Template-Size-for-Blog-Photos-24-500x500.jpg" },
        { name: "Fruit Salad with Custard", price: "₹130", img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/05/fruit-custard-recipe.jpg" },
        { name: "Choco Lava Cake", price: "₹140", img: "https://www.bakels.in/wp-content/uploads/sites/15/2019/10/unnamed.jpg" }
    ],
    "rice": [
        { name: "Steamed Basmati Rice", price: "₹40", img: "https://media.soscuisine.com/images/recettes/large/2887.jpg" },
        { name: "Jeera Rice", price: "₹50", img: "https://lentillovingfamily.com/wp-content/uploads/2025/08/jeera-rice-1-500x375.jpg" },
        { name: "Veg Pulao", price: "₹70", img: "https://www.kuchpakrahahai.in/wp-content/uploads/2017/12/Veg-Pulao.jpg" },
        { name: "Kashmiri Pulao", price: "₹180", img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/kashmiri-pulao-recipe.jpg" },
        { name: "Lemon Rice", price: "₹130", img: "https://static.toiimg.com/photo/53870704.cms" },
        { name: "Schezwan Fried Rice", price: "₹160", img: "https://www.pavaniskitchen.com/wp-content/uploads/2021/08/schezwan-veg-fried-rice.jpg" },
        { name: "Egg Fried Rice", price: "₹170", img: "https://iamhomesteader.com/wp-content/uploads/2021/01/fried-rice-500x500.jpg" },
        { name: "Chicken Fried Rice", price: "₹200", img: "https://40aprons.com/wp-content/uploads/2022/03/chicken-fried-rice-3.jpg" },
        { name: "Mushroom Fried Rice", price: "₹180", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiTc-jNM80z0ufeuGFEheFyf2NLpKuoEnJew&s" }
    ],
    "pasta": [
        { name: "White Sauce Pasta", price: "₹180", img: "https://www.indianhealthyrecipes.com/wp-content/uploads/2024/04/white-sauce-pasta-500x500.jpg" },
        { name: "Red Sauce Pasta", price: "₹160", img: "https://3.imimg.com/data3/VY/VM/MY-3746163/red-sauce-pasta.jpg" },
        { name: "Pink Sauce Pasta", price: "₹190", img: "https://www.chefkunalkapur.com/wp-content/uploads/2022/10/DSC02401-1-scaled.jpg?v=1666713894" },
        { name: "Arrabiata Pasta", price: "₹170", img: "https://shwetainthekitchen.com/wp-content/uploads/2021/04/Pasta-Arrabiata.jpg" },
        { name: "Alfredo Chicken Pasta", price: "₹220", img: "https://www.number-2-pencil.com/wp-content/uploads/2019/07/One-Pot-Chicken-Alfredo-7.jpg" },
        { name: "Basil Pesto pasta ", price: "₹210", img: "https://www.funfoodfrolic.com/wp-content/uploads/2020/09/Basil-Pesto-Thumbnail.jpg" },
        { name: "Macaroni Cheese", price: "₹150", img: "https://www.allrecipes.com/thmb/e8uotDI18ieXNBY0KpmtGKbxMRM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/238691-Simple-Macaroni-And-Cheese-mfs_008-4x3-6ed91ba87a1344558aacc0f9ef0f4b41.jpg" },
        { name: "Lasagna (Veg)", price: "₹250", img: "https://cdn.loveandlemons.com/wp-content/uploads/2023/12/vegetarian-lasagna-scaled.jpg" },
        { name: "Spaghetti Aglio e Olio", price: "₹200", img: "https://www.gustini.co.uk/blog/wp-content/uploads/2022/05/Aglio-e-Olio_Rezept-Vorschau-03.jpg" },
        { name: "Ravioli", price: "₹240", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP2Vvs78y5BnWkpd5LYP1pVxwELFbf6qew1Q&s" }
    ],
    "veg biryani": [
        { name: "Hyderabadi Veg Biryani", price: "₹180", img: "https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2019/05/Hyderabadi-Veg-Biryani-H1.jpg?fit=600%2C900&ssl=1" },
        { name: "Paneer Biryani", price: "₹210", img: "https://ministryofcurry.com/wp-content/uploads/2023/10/paneer-biryani_-9.jpg" },
        { name: "Soya Chaap Biryani", price: "₹190", img: "https://badshahchap.com/cdn/shop/articles/d6711035ffedfaa2cdc738ab89817058.jpg?v=1729066451" },
        { name: "Lucknowi Veg Dum Biryani", price: "₹199", img: "https://i0.wp.com/experteatshub.com/wp-content/uploads/2025/03/Lucknowi-Veg-Dum-Biryani-1.jpg?fit=417%2C417&ssl=1" },
        { name: "Mushroom Biryani", price: "₹210", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7auDsy6OAofnzc8F00KKtQIAojPmGaEip3A&s" },
        { name: "Kathal Biryani", price: "₹220", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAROnAtzLGXk999fynZXcXjsBUx1458spMLA&s" },
        // { name: "Handi Veg Biryani", price: "₹190", img: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=300&q=80" },
        { name: "Paneer Tikka Biryani", price: "₹200", img: "https://i.ytimg.com/vi/oEtga05Slcg/sddefault.jpg" },
        { name: "Dum Aloo Biryani", price: "₹170", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVdy8hBNCSwtRpKAlmGkc2WLQWbDuig_YmTQ&s" },
        { name: "Special Mix Veg Biryani", price: "₹230", img: "https://i.ytimg.com/vi/81kbQLXr7a4/sddefault.jpg" }
    ],
    "starters": [
        { name: "Paneer 65", price: "₹180", img: "https://www.chefkunalkapur.com/wp-content/uploads/2021/12/Paneer-65-1300x867.jpg?v=1639030023" },
        { name: "Honey Chilli Potato", price: "₹150", img: "https://recipes.timesofindia.com/thumb/52532656.cms?width=1200&height=900" },
        { name: "Veg Manchurian", price: "₹140", img: "https://easyindiancookbook.com/wp-content/uploads/2023/09/veg-manchurian-3.jpg" },
        { name: "Crispy Corn", price: "₹130", img: "https://rakskitchen.net/wp-content/uploads/2022/01/crisp-corn-500x375.jpg" },
        { name: "Chicken Wings", price: "₹220", img: "https://images.services.kitchenstories.io/Wicl1sGntEDmWP2bo1Zc8_FC_ZQ=/3840x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R13-chicken-wings-title-photo.jpg" },
        { name: "Fish Tikka", price: "₹280", img: "https://vaya.in/recipes/wp-content/uploads/2018/03/Fish-Tikka.jpg" },
        { name: "Soya Malai Chaap", price: "₹170", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-RRSXrelri_Obva-T9frjEi4NRXbt8bTadQ&s" },
        { name: "Dahi Ke Sholay", price: "₹160", img: "https://www.kuchpakrahahai.in/wp-content/uploads/2017/09/DSC_1222-2Bcopy.jpg" },
        { name: "French Fries", price: "₹90", img: "https://www.allrecipes.com/thmb/8_B6OD1w6h1V0zPi8KAGzD41Kzs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/50223-homemade-crispy-seasoned-french-fries-VAT-Beauty-4x3-789ecb2eaed34d6e879b9a93dd56a50a.jpg" }
    ],
    "chapati": [
        { name: "Tawa Roti", price: "₹10", img: "https://parafit.in/wp-content/uploads/2019/03/Tawa-Roti-600x500.jpg" },
        { name: "Butter Tawa Roti", price: "₹12", img: "https://deliveryraja.com/wp-content/uploads/2024/09/images-16-3.webp" },
        { name: "Rumali Roti", price: "₹20", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYidyXJVMT5w7vJInSCXe3CgCVCekUTyBqmg&s" },
        { name: "Plain Naan", price: "₹30", img: "https://enjoyinfourseason.com/wp-content/uploads/2022/05/Fourseason-PLAIN-NAAN.jpg" },
        { name: "Butter Naan", price: "₹40", img: "https://i.ytimg.com/vi/H3tW-UFSojU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBYPNO1t9Z86EFlkaFQu8wPoYpLsQ" },
        { name: "Garlic Naan", price: "₹50", img: "https://lentillovingfamily.com/wp-content/uploads/2024/11/garlic-naan-1.jpg" },
        { name: "Lachha Paratha", price: "₹35", img: "https://www.cookclickndevour.com/wp-content/uploads/2015/07/lachha-paratha-recipe-a1.jpg" },
        { name: "Missi Roti", price: "₹25", img: "https://i0.wp.com/onewholesomemeal.com/wp-content/uploads/2020/04/IMG_4649-2455.jpg?fit=864%2C1080&ssl=1" },
        { name: "Aloo Paratha", price: "₹50", img: "https://butfirstchai.com/wp-content/uploads/2025/04/aloo-paratha-recipe-1-500x500.jpg" },
        { name: "Paneer Paratha", price: "₹70", img: "https://static.wixstatic.com/media/155fdf_427b0cef358647dabd9685a6acb4ef02~mv2.jpg/v1/fill/w_640,h_462,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/155fdf_427b0cef358647dabd9685a6acb4ef02~mv2.jpg" }
    ]
};



// 1. Modal ke elements ko select karna
const modal = document.getElementById("foodModal");
const varietyList = document.getElementById("varietyList");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.querySelector(".close-btn");

// 2. Har ek Food Card (grid-item) par click listener lagana
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
        // Card ke andar se food ka naam nikalna (e.g., "Chicken Biryani")
        const foodName = item.querySelector('.food-name').innerText.toLowerCase().trim();
        
        // Check karna ki kya hamare foodData mein yeh naam hai?
        if (foodData[foodName]) {
            // Modal ka title change karna
            modalTitle.innerText = foodName.toUpperCase();
            
            // Purani list ko saaf (clear) karna
            varietyList.innerHTML = ""; 

            // foodData se un 10 items ko nikal kar HTML mein convert karna
            foodData[foodName].forEach(v => {
                varietyList.innerHTML += `
                    <div class="variety-item">
                        <img src="${v.img}" alt="${v.name}" class="variety-img">
                        <div class="variety-details">
                            <h4>${v.name}</h4>
                            <p class="variety-price">${v.price}</p>
                            <button class="add-btn-small" onclick="addToCart('${v.name}', '${v.price}')">Add to Tray +</button>
                        </div>
                    </div>
                `;
            });
            
            // Modal ko screen par dikhana
            modal.style.display = "block"; 
        }
    });
});

// 3. Modal band karne ka logic (X button par click)
closeBtn.onclick = () => {
    modal.style.display = "none";
};

// 4. Modal band karne ka logic (Screen par kahin bhi bahar click)
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// 5. Add to Cart function (Optionally abhi ke liye alert dikhayega)
// Global variable for Tray count
let trayCount = 0;

function addToCart(itemName, itemPrice) {
    // 1. Check karo ki kya 'isLoggedIn' memory mein true hai?
    const loginStatus = localStorage.getItem('isLoggedIn');

    if (loginStatus === 'true') {
        // CASE: User Logged In hai
        trayCount++;
        
        // Tray counter update karna (agar aapne screen par dikhaya hai)
        alert(`${itemName} added to tray! Total items: ${trayCount}`);
        
        // Yahan aap apna real cart logic daal sakte hain
    } else {
        // CASE: User ne skip kiya tha ya login nahi kiya
        alert("Please login first to add items to your tray!");
        
        // Login box ko wapas dikhao
        document.getElementById('login-overlay').classList.remove('hidden');
    }
}


// Counter setup globally
let totalTrayItems = 0;

function addToCart(itemName, itemPrice) {
    // 1. Pehle login validation check karein
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert("Please login first to add items to your tray!");
        document.getElementById('login-overlay').classList.remove('hidden');
        return;
    }

    // 2. Count ko +1 increase karein
    totalTrayItems++;

    // 3. UI elements ko update karein
    const cartStrip = document.getElementById('bottom-cart-strip');
    const itemCountSpan = document.getElementById('cart-item-count');

    if (cartStrip && itemCountSpan) {
        itemCountSpan.innerText = totalTrayItems; // Count change karein
        
        // Agar pehla item add hua hai, toh strip ko smoothly show karein
        cartStrip.classList.remove('hidden-cart');
    }
    
    console.log(`${itemName} added. Total items in tray: ${totalTrayItems}`);
}

// View Cart Button click handle function
function openCartPage() {
    alert("Opening your checkout tray with " + totalTrayItems + " items!");
    // Yahan aap apna checkout page modal ya navigation link set kar sakte hain
}


// Array to keep track of added array items list data mapping
let cartTrayItems = [];

function addToCart(itemName, itemPrice) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert("Please login first to continue!");
        document.getElementById('login-overlay').classList.remove('hidden');
        return;
    }

    // Cleaning string price to integer number format (e.g., "₹170" or "170" -> 170)
    const numericalPrice = parseInt(itemPrice.replace(/[^0-9]/g, ''));

    // Check if item already exists inside array list
    const existingItem = cartTrayItems.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartTrayItems.push({
            name: itemName,
            price: numericalPrice,
            quantity: 1
        });
    }

    // Update bottom strip counter count display bar view
    updateBottomStrip();
}

function updateBottomStrip() {
    const cartStrip = document.getElementById('bottom-cart-strip');
    const itemCountSpan = document.getElementById('cart-item-count');
    
    // Total aggregate count calculation loop
    const totalCount = cartTrayItems.reduce((acc, current) => acc + current.quantity, 0);

    if (totalCount > 0) {
        itemCountSpan.innerText = totalCount;
        cartStrip.classList.remove('hidden-cart');
    } else {
        cartStrip.classList.add('hidden-cart');
    }
}

// --- OPEN CART VIEW SCREEN ---
function openCartPage() {
    // Hidden bottom notification bar container strip view box
    document.getElementById('bottom-cart-strip').classList.add('hidden-cart');
    
    const cartPage = document.getElementById('cart-page');
    const itemsListContainer = document.getElementById('cart-items-list');
    
    // Show cart full screen view container area layout layout structure map
    cartPage.classList.remove('hidden-layout');
    
    itemsListContainer.innerHTML = "";
    let grandTotalSum = 0;

    cartTrayItems.forEach((item, index) => {
        const itemCostTotal = item.price * item.quantity;
        grandTotalSum += itemCostTotal;

        itemsListContainer.innerHTML += `
            <div class="cart-item-row">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color:#666; font-size:13px;">₹${item.price} x ${item.quantity}</span>
                </div>
                <div style="font-weight: bold; color: #222;">
                    ₹${itemCostTotal}
                </div>
            </div>
        `;
    });

    document.getElementById('cart-grand-total').innerText = "₹" + grandTotalSum;
}

// Add recommendations items instantly inside cart view container arrays
function addRecommendation(name, price) {
    addToCart(name, price.toString());
    openCartPage(); // Refresh calculation views inside container viewport panel
}

function goBackToMenu() {
    document.getElementById('cart-page').classList.add('hidden-layout');
    updateBottomStrip(); // Restore view visibility configurations logic mapping
}

function triggerPlaceOrder() {
    alert("🎉 Order placed successfully! Thank you for ordering from CanteenGo.");
    cartTrayItems = []; // Clean values bucket
    goBackToMenu();
}