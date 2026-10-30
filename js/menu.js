/* ==========================================================================
   MENU DATA  –  edit this file to change dishes, prices, photos and categories
   --------------------------------------------------------------------------
   CATEGORIES : order here = order on the site. "id" must match item.category.
   ITEMS      : one object per dish.
      id           unique, no spaces (used by the cart)
      category     one of the category ids below
      name         dish name
      description  optional short text
      price        number (no currency symbol).  Use "sizes" instead for size-based prices
      sizes        optional: [{ label:"Small", price:30 }, ...]  (customer picks one)
      image        path to photo, or null to show the branded placeholder
      illustrative true = the photo is a similar-looking stand-in; the card shows an "Illustration" tag.
                   Remove this flag once you add the dish's real photo.
      popular      true = shown in "Popular right now" on the home page
      fit          "cover" (default) or "contain" (for bottle shots on white)
      soldOut      true = shows "Sold out" and disables Add to cart
   To hide a whole category, delete it from CATEGORIES (its items are then hidden too).
   ========================================================================== */

window.MENU_CATEGORIES = [
  { id: "kabab", label: "Kabab & Grill" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "pizza", label: "Pizza" },
  { id: "appetizers", label: "Appetizers" },
  { id: "salads", label: "Salads & Dips" },
  { id: "rice", label: "Rice" },
  { id: "bakery", label: "Bakery" },
  { id: "platters", label: "Platters" },
  { id: "eggs", label: "Eggs" },
  { id: "drinks", label: "Drinks" },
];

/* !!! PIZZA PRICES: your menu PDF only said "Price by size" (no amounts).
   The Small / Medium / Large prices below are PLACEHOLDERS – please replace them
   with your real prices (see PIZZA_SIZES just below). */
const PIZZA_SIZES = [
  { label: "Small", price: 30 },
  { label: "Medium", price: 45 },
  { label: "Large", price: 60 },
];

window.MENU_ITEMS = [

  /* ---------- Kabab & Grill ---------- */
  { id: "kabab-koobideh", category: "kabab", name: "Kabab Koobideh", description: "Spiced ground meat skewers, grilled to juicy perfection, offering a tender, smoky flavor.", price: 60, image: "images/menu/kabab-koobideh.jpg", popular: true },
  { id: "mutton-tikka", category: "kabab", name: "Mutton Tikka", description: "Juicy mutton marinated with aromatic spices, grilled to a flavorful and tender finish.", price: 55, image: "images/menu/mutton-tikka.jpg" },
  { id: "chicken-yogurt", category: "kabab", name: "Chicken Yogurt", description: "Tender chicken marinated in yogurt and spices, grilled to a smoky, tender texture.", price: 55, image: "images/menu/chicken-yogurt.jpg" },
  { id: "lemon-tikka-meat", category: "kabab", name: "Lemon Tikka Meat", description: "Marinated meat skewers with a tangy lemon flavor, grilled to a perfect golden brown.", price: 55, image: "images/menu/lemon-tikka-meat.jpg" },
  { id: "tikka-lamb", category: "kabab", name: "Tikka Lamb", description: "Succulent lamb chunks, marinated in flavorful spices, grilled to achieve a tender, charred texture.", price: 65, image: "images/menu/tikka-lamb.jpg" },
  { id: "chicken-with-bone", category: "kabab", name: "Chicken With Bone", description: "Juicy chicken pieces, grilled on the bone for a smoky, flavorful bite.", price: 55, image: "images/menu/chicken-with-bone.jpg" },
  { id: "lamb-chops", category: "kabab", name: "Lamb Chops", description: "Tender lamb chops seasoned with herbs and spices, grilled to perfection for a savory, smoky finish.", price: 75, image: "images/menu/lamb-chops.jpg", popular: true },
  { id: "chicken-with-saffron", category: "kabab", name: "Chicken With Saffron", description: "Grilled chicken infused with aromatic saffron, providing a fragrant and flavorful taste.", price: 55, image: "images/menu/chicken-with-saffron.jpg", popular: true },
  { id: "chicken-kabab-koobideh", category: "kabab", name: "Chicken Kabab Koobideh", description: "Ground chicken skewers, spiced and grilled to a juicy, flavorful finish, served with warm rice.", price: 55, image: "images/menu/chicken-kabab-koobideh.jpg" },
  { id: "soltani", category: "kabab", name: "Soltani", description: "A combination of two delicious skewers, one of juicy kabab koobideh and one other of grilled lamb.", price: 65, image: "images/menu/soltani.jpg" },
  { id: "chicken-wings", category: "kabab", name: "Chicken Wings", description: "Crispy, grilled chicken wings coated with flavorful spices, offering a smoky, juicy bite.", price: 55, image: "images/menu/chicken-wings.jpg" },
  { id: "barg-kabab", category: "kabab", name: "Barg Kabab", description: "Tender lamb steak skewers, grilled with aromatic spices for a juicy, rich, smoky flavor.", price: 60, image: "images/menu/barg-kabab.jpg" },
  { id: "camel-tikka", category: "kabab", name: "Camel Tikka", description: "Grilled camel meat marinated in spices, providing a unique and flavorful tender bite.", price: 65, image: "images/menu/camel-tikka.jpg" },
  { id: "quail", category: "kabab", name: "Quail", description: "Grilled or roasted quail, offering a delicate, tender meat with a rich, smoky flavor.", price: 55, image: "images/menu/quail.jpg" },
  { id: "mix-kebab", category: "kabab", name: "Mix Kebab", description: "A variety of grilled kebabs, combining chicken, lamb, and beef, seasoned and served with sides.", price: 65, image: "images/menu/mix-kebab.jpg" },
  { id: "grilled-lamb-parts", category: "kabab", name: "Grilled Lamb Parts", description: "Various cuts of lamb grilled to smoky perfection, offering tender, juicy pieces with rich flavors.", price: 90, image: "images/menu/grilled-lamb-parts.jpg" },
  { id: "special-mix-kebab-5-person", category: "kabab", name: "Special Mix Kebab 5 Person", description: "24 skewers, served with 2 hummus, 5 rice, bread and salad.", price: 415, image: "images/menu/special-mix-kebab-5-person.jpg" },
  { id: "special-mix-kebab-3-or-4-persons", category: "kabab", name: "Special Mix Kebab 3 Or 4 Persons", description: "15 skewers, 1 hummus, bread and salad.", price: 205, image: "images/menu/special-mix-kebab-3-or-4-persons.jpg", popular: true },
  { id: "grilled-seabream", category: "kabab", name: "Grilled Seabream", description: "Fresh seabream grilled to a smoky perfection, offering a tender, flaky texture with a rich flavor.", price: 65, image: "images/menu/grilled-seabream.jpg" },
  { id: "barberry-rice-with-chicken", category: "kabab", name: "Barberry Rice With Chicken", description: "Fragrant rice mixed with sweet-tart barberries, served with tender grilled chicken for a balanced dish.", price: 60, image: "images/menu/barberry-rice-with-chicken.jpg" },
  { id: "lamb-neck-with-rice", category: "kabab", name: "Lamb Neck With Rice", description: "Tender lamb neck cooked with aromatic spices, served over fluffy rice for a rich, flavorful meal.", price: 85, image: "images/menu/lamb-neck-with-rice.jpg" },
  { id: "lamb-shank-with-rice", category: "kabab", name: "Lamb Shank With Rice", description: "Slow-cooked lamb shank, seasoned with herbs and spices, served with rice.", price: 85, image: "images/menu/lamb-shank-with-rice.jpg" },
  { id: "kalah-pashe", category: "kabab", name: "Kalah Pashe", description: "A Persian dish made from lamb head, slow-cooked with herbs and spices, served with bread.", price: 75, image: "images/menu/kalah-pashe.jpg" },
  { id: "kabab-koobideh-with-rice-cholo", category: "kabab", name: "Kabab Koobideh With Rice Cholo", description: "Ground meat skewers grilled to perfection, served with fragrant rice, for a filling meal.", price: 55, image: "images/menu/kabab-koobideh-with-rice-cholo.jpg" },
  { id: "chicken-kabab-with-rice", category: "kabab", name: "Chicken Kabab With Rice", description: "Marinated chicken skewers, grilled until tender, served with aromatic rice.", price: 55, image: "images/menu/chicken-kabab-with-rice.jpg" },
  { id: "kabab-barg-with-rice", category: "kabab", name: "Kabab Barg With Rice", description: "Tender lamb steak skewers grilled with spices, served with seasoned rice.", price: 60, image: "images/menu/kabab-barg-with-rice.jpg", popular: true },
  { id: "kabab-sultani-with-rice", category: "kabab", name: "Kabab Sultani With Rice", description: "A combination of kabab koobideh and kabab barg, served with fluffy rice for a savory dish.", price: 75, image: "images/menu/kabab-sultani-with-rice.jpg" },
  { id: "mix-kebab-with-rice", category: "kabab", name: "Mix Kebab With Rice", description: "A selection of grilled chicken, lamb, and beef kebabs served with fragrant rice.", price: 65, image: "images/menu/mix-kebab-with-rice.jpg", popular: true },
  { id: "grilled-lamb-parts-liver-heart-kidney-denbelan", category: "kabab", name: "Grilled Lamb Parts (Liver, Heart, Kidney, Denbelan)", description: "Grilled lamb organs, including liver, heart, and kidneys, served with seasoned rice for a unique, flavorful experience.", price: 50, image: "images/menu/grilled-lamb-parts.jpg", illustrative: true },
  { id: "dizy", category: "kabab", name: "Dizy", description: "Traditional Persian lamb stew with chickpeas, vegetables, and a blend of spices, offering a rich, savory flavor.", price: 85, image: "images/menu/dizy.jpg" },

  /* ---------- Sandwiches ---------- */
  { id: "charcoal-burger-sandwich", category: "sandwiches", name: "Charcoal Burger Sandwich", description: "A grilled charcoal burger patty, offering a smoky, juicy texture, perfect for a delicious sandwich.", price: 50, image: "images/menu/charcoal-burger-sandwich.jpg" },
  { id: "hayoola-special-feri-kasif-sandwich", category: "sandwiches", name: "Hayoola Special Feri Kasif Sandwich", description: "Beef steak, roast beef, brain, tongue, mushroom and cheese.", price: 35, image: "images/menu/beef-steak-sandwich.jpg", illustrative: true },
  { id: "hot-food-sandwich", category: "sandwiches", name: "Hot Food Sandwich", description: "Beef steak, chicken breast and hot sauce.", price: 35, image: "images/menu/top-food-sandwich.jpg", illustrative: true },
  { id: "top-food-sandwich", category: "sandwiches", name: "Top Food Sandwich", description: "Premium sandwich featuring tender beef steak combined with savory beef and chicken mortadella slices layered for maximum flavor and satisfaction.", price: 45, image: "images/menu/top-food-sandwich.jpg" },
  { id: "godzilla-sandwich", category: "sandwiches", name: "Godzilla Sandwich", description: "Hotdog, chicken breast, pepperoni sausage and hot sauce.", price: 40, image: "images/menu/godzilla-sandwich.jpg" },
  { id: "kokoli-sandwich", category: "sandwiches", name: "Kokoli Sandwich", description: "Cheese sausage and beef and chicken mortadella.", price: 35, image: "images/menu/kapola-sandwich.jpg", illustrative: true },
  { id: "marcopolo-sandwich", category: "sandwiches", name: "Marcopolo Sandwich", description: "Fillet beef, beef and chicken mortadella and chicken breast.", price: 35, image: "images/menu/godzilla-sandwich.jpg", illustrative: true },
  { id: "beef-steak-sandwich", category: "sandwiches", name: "Beef Steak Sandwich", description: "Tender beef steak marinated with aromatic spices and grilled to perfection, served on a soft toasted bun with fresh lettuce, tomato, and savory sauce.", price: 40, image: "images/menu/beef-steak-sandwich.jpg" },
  { id: "roast-beef-sandwich", category: "sandwiches", name: "Roast Beef Sandwich", price: 35, image: "images/menu/beef-steak-sandwich.jpg", illustrative: true },
  { id: "chicken-fillet-sandwich", category: "sandwiches", name: "Chicken Fillet Sandwich", description: "Marinated with healthy herbs, lemon and garlic.", price: 40, image: "images/menu/chicken-fillet-sandwich.jpg" },
  { id: "fadat-sham-sandwich", category: "sandwiches", name: "Fadat Sham Sandwich", description: "Beef burger, hot sauce, beef bacon, onion, cheese and mushroom.", price: 35, image: "images/menu/charcoal-burger-sandwich.jpg", illustrative: true },
  { id: "kapola-sandwich", category: "sandwiches", name: "Kapola Sandwich", description: "Cheese sausage, hotdog and pepperoni sausage.", price: 40, image: "images/menu/kapola-sandwich.jpg" },
  { id: "bari-bakh-sandwich", category: "sandwiches", name: "Bari Bakh Sandwich", description: "Beef steak, roast beef, beef mortadella, sausage, cheese, onions and parsley.", price: 35, image: "images/menu/top-food-sandwich.jpg", illustrative: true },
  { id: "troy-sandwich", category: "sandwiches", name: "Troy Sandwich", description: "Beef burger, hotdog, pepperoni, sausage and mayonnaise.", price: 35, image: "images/menu/kapola-sandwich.jpg", illustrative: true },
  { id: "panapa-sandwich", category: "sandwiches", name: "Panapa Sandwich", description: "Made from slow-cooked meats and spices, offering a tender, flavorful bite.", price: 40, image: "images/menu/beef-steak-sandwich.jpg", illustrative: true },

  /* ---------- Pizza ---------- */
  { id: "special-pizza", category: "pizza", name: "Special Pizza", description: "Hotdog, beef and chicken mortadella.", sizes: PIZZA_SIZES, image: "images/menu/special-pizza.jpg" },
  { id: "red-pizza", category: "pizza", name: "Red Pizza", description: "Beef mortadella, grilled beef steak and pepperoni sausage.", sizes: PIZZA_SIZES, image: "images/menu/pepperoni-pizza.jpg", illustrative: true },
  { id: "mamali-pizza", category: "pizza", name: "Mamali Pizza", description: "Hotdog, minced beef, onion and beef.", sizes: PIZZA_SIZES, image: "images/menu/mamali-pizza.jpg" },
  { id: "mashinaz-pizza", category: "pizza", name: "Mashinaz Pizza", description: "Steak, garlic, mushroom, tomato and paprika.", sizes: PIZZA_SIZES, image: "images/menu/beef-and-mushroom-pizza.jpg", illustrative: true },
  { id: "dantez-pizza", category: "pizza", name: "Dantez Pizza", description: "Beef burger, pepperoni sausage and pickles.", sizes: PIZZA_SIZES, image: "images/menu/dantez-pizza.jpg" },
  { id: "white-pizza", category: "pizza", name: "White Pizza", description: "Chicken mortadella, chicken fillet and mayo sauce.", sizes: PIZZA_SIZES, image: "images/menu/chicken-pizza.jpg", illustrative: true },
  { id: "vegetables-pizza", category: "pizza", name: "Vegetables Pizza", description: "Pizza topped with a variety of fresh vegetables, offering a light vegetarian option.", sizes: PIZZA_SIZES, image: "images/menu/mamali-pizza.jpg", illustrative: true },
  { id: "beef-and-mushroom-pizza", category: "pizza", name: "Beef And Mushroom Pizza", description: "Hearty pizza with savory beef and mushrooms, complemented by melted cheese and tomato sauce.", sizes: PIZZA_SIZES, image: "images/menu/beef-and-mushroom-pizza.jpg" },
  { id: "pepperoni-pizza", category: "pizza", name: "Pepperoni Pizza", description: "Classic pizza topped with spicy pepperoni, cheese, and a rich tomato sauce.", sizes: PIZZA_SIZES, image: "images/menu/pepperoni-pizza.jpg" },
  { id: "margarita-pizza", category: "pizza", name: "Margarita Pizza", description: "Simple pizza with fresh mozzarella, tomato sauce, and basil, offering a light, classic flavor.", sizes: PIZZA_SIZES, image: "images/menu/margarita-pizza.jpg" },
  { id: "chicken-pizza", category: "pizza", name: "Chicken Pizza", description: "Pizza topped with tender chicken, vegetables, and a savory sauce.", sizes: PIZZA_SIZES, image: "images/menu/chicken-pizza.jpg" },
  { id: "sausage-bandari-pizza", category: "pizza", name: "Sausage Bandari Pizza", description: "Pizza topped with spiced sausage, offering a savory and smoky flavor with melted cheese and tomato sauce.", sizes: PIZZA_SIZES, image: "images/menu/sausage-bandari-pizza.jpg" },

  /* ---------- Appetizers ---------- */
  { id: "french-fries-with-cheese-mushroom", category: "appetizers", name: "French Fries With Cheese Mushroom", description: "Crispy golden fries topped with melted cheese and savory mushrooms for a comforting treat.", price: 20, image: "images/menu/french-fries-with-cheese-mushroom.jpg" },
  { id: "french-fries", category: "appetizers", name: "French Fries", description: "Crispy and golden fried potato strips, perfect as a side or snack.", price: 20, image: "images/menu/french-fries.jpg" },
  { id: "ghormi-sabzi-stew-with-rice", category: "appetizers", name: "Ghormi Sabzi Stew With Rice", description: "Savory stew of greens, herbs, and tender meat served with rice, offering a rich Persian flavor.", price: 55, image: "images/menu/ghormi-sabzi-stew-with-rice.jpg" },
  { id: "okra-stew-with-rice", category: "appetizers", name: "Okra Stew With Rice", description: "Stewed okra cooked in a spiced tomato sauce, served over rice for a filling, and comforting meal.", price: 55, image: "images/menu/okra-stew-with-rice.jpg" },
  { id: "grilled-shrimp", category: "appetizers", name: "Grilled Shrimp", description: "Shrimp marinated in a blend of spices, grilled to perfection, providing a tender, smoky flavor.", price: 75, image: "images/menu/grilled-shrimp.jpg" },
  { id: "kase-kabab-khoory-5-skewers", category: "appetizers", name: "Kase Kabab Khoory 5 Skewers", description: "Five skewers of seasoned kababs, grilled to a perfect char with savory, tender meat.", price: 70, image: "images/menu/kase-kabab-khoory-5-skewers.jpg" },
  { id: "ghelie-mahi-stew", category: "appetizers", name: "Ghelie Mahi Stew", description: "A fragrant fish stew, cooked with aromatic spices, herbs, and a flavorful broth.", price: 65, image: "images/menu/ghelie-mahi-stew.jpg" },
  { id: "eggplant-stew", category: "appetizers", name: "Eggplant Stew", description: "Rich and savory stew with tender eggplants, cooked in a spiced tomato-based sauce.", price: 55, image: "images/menu/eggplant-stew.jpg" },
  { id: "lentil-soup", category: "appetizers", name: "Lentil Soup", description: "Hearty, flavorful lentil soup with aromatic spices and fresh herbs for a wholesome experience.", price: 10, image: "images/menu/lentil-soup.jpg" },
  { id: "aash", category: "appetizers", name: "Aash", description: "Traditional Persian soup with herbs, noodles, and vegetables, served warm for comfort and nourishment.", price: 20, image: "images/menu/aash.jpg" },

  /* ---------- Salads & Dips ---------- */
  { id: "moutabbal", category: "salads", name: "Moutabbal", description: "Smoky roasted eggplant blended with tahini, garlic, lemon and olive oil for a creamy dip.", price: 18, image: "images/menu/moutabbal.jpg" },
  { id: "hummus", category: "salads", name: "Hummus", description: "Creamy blend of chickpeas, tahini, lemon and garlic served as a smooth and flavorful dip.", price: 18, image: "images/menu/hummus.jpg" },
  { id: "labneh", category: "salads", name: "Labneh", description: "Creamy, tangy yogurt cheese often served with olive oil, herbs and flatbread for dipping.", price: 15, image: "images/menu/labneh.jpg" },
  { id: "spinach-yogurt", category: "salads", name: "Spinach Yogurt", description: "Fresh spinach mixed with creamy yogurt and a touch of garlic, offering a light and refreshing flavor.", price: 18, image: "images/menu/spinach-yogurt.jpg" },
  { id: "mast-moosir", category: "salads", name: "Mast Moosir", description: "Creamy yogurt combined with tangy shallots creating a smooth and flavorful Persian side dish.", price: 7, image: "images/menu/mast-moosir.jpg" },
  { id: "kashk-bademjan", category: "salads", name: "Kashk Bademjan", description: "A savory dish of eggplant cooked in a spiced tomato sauce, offering a rich and smoky flavor.", price: 30, image: "images/menu/kashk-bademjan.jpg" },
  { id: "cheese-with-tomato-and-cucumber", category: "salads", name: "Cheese With Tomato And Cucumber", description: "Fresh tomato and cucumber slices topped with cheese, providing a refreshing and light dish.", price: 20, image: "images/menu/cheese-with-tomato-and-cucumber.jpg" },
  { id: "indonesian-salad", category: "salads", name: "Indonesian Salad", description: "Mix of fresh vegetables, herbs and tangy dressings offering zesty and crunchy salad.", price: 20, image: "images/menu/indonesian-salad.jpg" },
  { id: "caesar-salad", category: "salads", name: "Caesar Salad", description: "Crisp lettuce, croutons and Parmesan tossed in a creamy Caesar dressing, offering a classic and savory taste.", price: 20, image: "images/menu/caesar-salad.jpg" },
  { id: "rocca-salad", category: "salads", name: "Rocca Salad", description: "A peppery arugula salad paired with fresh vegetables and a tangy vinaigrette dressing.", price: 20, image: "images/menu/rocca-salad.jpg" },
  { id: "beetroot-salad", category: "salads", name: "Beetroot Salad", description: "Roasted or pickled beets mixed with fresh greens, offering sweet and earthy flavor.", price: 20, image: "images/menu/beetroot-salad.jpg" },
  { id: "fattoush", category: "salads", name: "Fattoush", description: "A fresh and crunchy salad with mixed vegetables, toasted pita chips and a tangy lemon dressing.", price: 20, image: "images/menu/fattoush.jpg" },
  { id: "tabbouleh", category: "salads", name: "Tabbouleh", description: "A light and refreshing salad of parsley, tomatoes, bulgur and mint dressed in lemon and olive oil.", price: 20, image: "images/menu/tabbouleh.jpg" },
  { id: "shirazi-salad", category: "salads", name: "Shirazi Salad", description: "A Persian salad made with tomatoes, cucumbers, onions, and herbs dressed in lemon juice and olive oil.", price: 20, image: "images/menu/shirazi-salad.jpg" },

  /* ---------- Rice ---------- */
  { id: "green-rice", category: "rice", name: "Green Rice", description: "Rice", price: 15, image: "images/menu/green-rice.jpg", illustrative: true },
  { id: "zaffan-rice", category: "rice", name: "Zaffan Rice", description: "Rice", price: 12, image: "images/menu/zaffan-rice.jpg" },

  /* ---------- Bakery ---------- */
  { id: "noon-sangak-bread", category: "bakery", name: "Noon Sangak Bread", price: 10, image: "images/menu/noon-sangak-bread.jpg" },
  { id: "bread", category: "bakery", name: "Bread", description: "Freshly baked bread, with golden crust, soft texture, and enticing aroma.", price: 2, image: "images/menu/bread.jpg" },

  /* ---------- Platters ---------- */
  { id: "brain-and-tongue-platter", category: "platters", name: "Brain And Tongue Platter", description: "A platter featuring brain and tongue, slow-cooked to perfection with spices for a savory taste.", price: 50, image: "images/menu/brain-and-tongue-platter.jpg" },

  /* ---------- Eggs ---------- */
  { id: "omelette", category: "eggs", name: "Omelette", description: "Fluffy eggs cooked with your choice of fillings like vegetables or cheese, seasoned to perfection.", price: 40, image: "images/menu/omelette.jpg" },

  /* ---------- Drinks ---------- */
  { id: "limonade", category: "drinks", name: "Limonade", price: 7, image: "images/menu/limonade.jpg", fit: "contain" },
  { id: "laban-qamarzada", category: "drinks", name: "Laban Qamarzada", description: "Laban", price: 6, image: "images/menu/laban-qamarzada.jpg", fit: "contain" },
  { id: "doogh-abeali", category: "drinks", name: "Doogh Abeali", price: 7, image: "images/menu/doogh-abeali.jpg", fit: "contain" },
  { id: "coca-cola", category: "drinks", name: "Coca Cola", price: 5, image: "images/menu/coca-cola.jpg" },
  { id: "mountain-dew", category: "drinks", name: "Mountain Dew", price: 5, image: "images/menu/mountain-dew.jpg" },
  { id: "pepsi", category: "drinks", name: "Pepsi", price: 5, image: "images/menu/pepsi.jpg" },
  { id: "mirinda-orange", category: "drinks", name: "Mirinda Orange", price: 5, image: "images/menu/mirinda-orange.jpg" },
  { id: "avocado-juice", category: "drinks", name: "Avocado Juice", price: 15, image: "images/menu/avocado-juice.jpg" },
  { id: "watermelon-juice", category: "drinks", name: "Watermelon Juice", price: 15, image: "images/menu/watermelon-juice.jpg" },
  { id: "apple-juice", category: "drinks", name: "Apple Juice", price: 15, image: "images/menu/apple-juice.jpg" },
  { id: "lemon-mint-juice", category: "drinks", name: "Lemon Mint Juice", price: 15, image: "images/menu/lemon-mint-juice.jpg" },
  { id: "orange-juice", category: "drinks", name: "Orange Juice", price: 15, image: "images/menu/orange-juice.jpg" },
  { id: "pineapple-juice", category: "drinks", name: "Pineapple Juice", price: 15, image: "images/menu/pineapple-juice.jpg" },
  { id: "mango-juice", category: "drinks", name: "Mango Juice", price: 15, image: "images/menu/mango-juice.jpg" },
  { id: "strawberry-juice", category: "drinks", name: "Strawberry Juice", price: 15, image: "images/menu/strawberry-juice.jpg" },
  { id: "carrot-juice", category: "drinks", name: "Carrot Juice", price: 15, image: "images/menu/carrot-juice.jpg" },

];
