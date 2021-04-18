const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "7zob83oo4ltb",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "Ak2sh0KD5TBmD8r0-UuCDuVUg6XDDcLFs50NL8GwKIo"
});
//-------------- Contentful ----------------------

const sideBar = document.querySelector(".side-bar");
const toggleSideBar = document.querySelector(".toggle-container");
const closeSideBar = document.querySelector(".close");

// Open The Side Bar
toggleSideBar.addEventListener("click", ()=>{
    showSideBar()
})

// Close The Side Bar
closeSideBar.addEventListener("click", ()=>{
    hideSideBar();
})

function showSideBar(){
    sideBar.classList.add("open");
    document.body.classList.add("aside-open")
}

function hideSideBar(){
    sideBar.classList.remove("open");
    document.body.classList.remove("aside-open")
}

/***********************************/

// Get (Fetch) The Products
//Show The Featured Products
let products;
window.addEventListener("load", ()=>{
    async function loadProduct(){
        try {
            //Get The Products From Local
            // const response = await fetch("../products.json");
            // const result = await response.json();

            //Get The Products From Contentful
            const contentful = await client.getEntries();

            products = contentful;
            if(window.location.pathname === "/index.html"){ //Show The Featured Products Only
                showFeatured();
            }
            else if (window.location.pathname === "/products.html"){ //Show All Products 
                showProducts();
            }
        } 
        catch (error) {
            console.log(error);
        }
        
    }
    loadProduct();
})

const featuredContainer = document.querySelector(".products-container");
function showFeatured(){
    for(let i = 0; i < 3 ; i++){
        createProduct(i,featuredContainer);
    }
}

function createProduct(index, container){
    //Create The Product Container
    let product = document.createElement("div");
    product.classList.add("product");

    //Create The Product Image Container
    let imageContainer = document.createElement("div");
    imageContainer.classList.add("product-image");

    //Create The Product Image
    let productImg = document.createElement("img");
    productImg.src = products.items[index].fields.image.fields.file.url;
    productImg.alt = products.items[index].fields.title;

    //Append The Image To The Container
    imageContainer.appendChild(productImg);

    //Create The Products Icons (add to cart / more info)
    let iconsContainer = document.createElement("div");
    iconsContainer.classList.add("product-icons");

    //Create The Add To Cart & More Info Icons
    let addIcon = document.createElement("img");
    addIcon.src = "../assets/cart.svg"; 
    addIcon.alt = "add to cart"; 
    addIcon.addEventListener("click", ()=>{
            counter++;
            countItems();
            updateTotal(products.items[index].fields.price);
            addItemToCart(index);
            showSideBar();

    });

    let moreIcon = document.createElement("img");
    moreIcon.src = "../assets/more.svg";
    moreIcon.alt = "more info";

    //Append The Icons To The Container
    iconsContainer.appendChild(addIcon);
    iconsContainer.appendChild(moreIcon);

    //Append The Icon Container To The Image Container
    imageContainer.appendChild(iconsContainer);

    //Create The Product Info Container
    let productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    //Create The Product Name
    let productName = document.createElement("p");
    productName.classList.add("product-name");
    productName.textContent = products.items[index].fields.title;

    //Create The Product Price
    let productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = products.items[index].fields.price + "$";

    //Append The Name & The Price To The Info Container
    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    //Append The Mini Containers To The Product Container
    product.appendChild(imageContainer);
    product.appendChild(productInfo);

    //Append The Product To The Page
    container.appendChild(product)
}

//Add Item To "Your Bag" (Side Bar)
const itemsContainer = document.querySelector(".cart-items");

function addItemToCart(index){
    //Create The Item
    let item = document.createElement("div");
    item.classList.add("item");

    //Create The Item Image
    let itemImage = document.createElement("img");
    itemImage.src = products.items[index].fields.image.fields.file.url;
    itemImage.alt = products.items[index].fields.title;

    //Create The Item Info
    let itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");
        //Item Name
        let itemName = document.createElement("p");
        itemName.classList.add("item-name");
        itemName.textContent = products.items[index].fields.title;
        //Item Price
        let itemPrice = document.createElement("p");
        itemPrice.classList.add("item-price");
        itemPrice.textContent = products.items[index].fields.price + "$";
        //Remove Item
        let removeItem = document.createElement("button");
        removeItem.classList.add("remove-item");
        removeItem.textContent = "remove";
        removeItem.addEventListener("click", ()=>{
            item.remove();
            counter -= itemCount;
            countItems();
            updateTotal(-products.items[index].fields.price * itemCount);
            if(counter === 0){
                hideSideBar()
            }
        })

    //Append The Info To The Info Container
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemPrice);
    itemInfo.appendChild(removeItem);

    //Create The Counter Container
    let counterContainer = document.createElement("div");
    counterContainer.classList.add("counter-container");

    //Create The Increase & Decrease Buttons
    let itemCount = 1;
    //The Item Count
    let itemCounter = document.createElement("span");
    itemCounter.classList.add("count");
    itemCounter.textContent = itemCount;
    //Increase Item
    let increaseItem = document.createElement("img");
    increaseItem.classList.add("increase-item");
    increaseItem.src = "assets/increase.svg";
    increaseItem.alt = "increase";
    increaseItem.addEventListener("click", ()=>{
        itemCount++;
        itemCounter.textContent = itemCount;
        counter++;
        countItems();
        updateTotal(products.items[index].fields.price);
    })
    //Decrease Item
    let decreaseItem = document.createElement("img");
    decreaseItem.classList.add("decrease-item");
    decreaseItem.src = "assets/decrease.svg";
    decreaseItem.alt = "decrease";
    decreaseItem.addEventListener("click", ()=>{
        if(itemCount === 1){
            removeItem.click();
        }
        else {
            itemCount--;
            itemCounter.textContent = itemCount;
            counter--;
            countItems();
            updateTotal(-products.items[index].fields.price);
            if(counter === 0){
                hideSideBar()
            }
        }
    })

    //Append The Increase & Decrease Buttons To The Counter Container
    counterContainer.appendChild(increaseItem); 
    counterContainer.appendChild(itemCounter); 
    counterContainer.appendChild(decreaseItem); 

    //Append All The Elements To The Item
    item.appendChild(itemImage);
    item.appendChild(itemInfo);
    item.appendChild(counterContainer);

    //Append The Item To The itemsContainer
    itemsContainer.appendChild(item);
}

//Cart Items Counter
const itemsCounter = document.querySelector(".item-count");
let counter = 0;

function countItems(){
    itemsCounter.textContent = counter;
}

//Update Total Price
const totalText = document.querySelector(".total-price");
let totalPrice = 0;

function updateTotal(newPrice){
    
    totalPrice += newPrice;
    if(totalPrice <=0 ){
        totalText.textContent = "0,00$";
    }
    else{
        totalText.textContent = `${totalPrice.toFixed(2)}$`;
    }
}

//Populate The Product Page
const productWrapper = document.querySelector(".products-wrapper");
function showProducts(){
    for(let i = 0; i < products.items.length ; i++){
        createProduct(i,productWrapper);
    }
}

//Filters

//Filtre 01 : Search Box
let searchBox = document.querySelector(".search-box");

searchBox.addEventListener("keyup", ()=>{
    for(let i = 0; i < productWrapper.children.length; i++){
        if(!productWrapper.children[i].children[1].children[0].textContent.includes(searchBox.value.toLowerCase())){
            productWrapper.children[i].style.display = "none";
        }
        else{
            productWrapper.children[i].style.display = "block";
        }
    }
})

//Filtre 02 : Companies

//Filtre 03: Price
let priceRange = document.querySelector(".price-range");
let rangeValue = document.querySelector(".range-value");

priceRange.addEventListener("input", ()=>{
    rangeValue.textContent = priceRange.value;
})
