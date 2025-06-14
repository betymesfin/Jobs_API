import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { showReviews } from "./reviews.js";

let restaurantsDiv = null;
let restaurantTable = null;
let restaurantTableHeader = null;

export const handleRestaurants = () => {
  restaurantsDiv = document.getElementById("restaurant");
  const logoff = document.getElementById("logoff");
  const myReviews = document.getElementById("my-reviews");
  restaurantTable = document.getElementById("restaurants-table");
  restaurantTableHeader = document.getElementById("restaurant-table-header");

  restaurantsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target.classList.contains("addReview")) {
        const restaurantId = e.target.dataset.id;
        showAddEdit(null, restaurantId);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        restaurantTable.replaceChildren([restaurantTableHeader]);
        showLoginRegister();
      } else if (e.target === myReviews) {
        showReviews();
      }
    }
  });
};

export const showRestaurant = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/restaurant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const restaurants = Array.isArray(data) ? data : [];
    let children = [restaurantTableHeader];

    if (response.status === 200) {
      if (restaurants.length === 0) {
        message.textContent = "No restaurants available.";
        restaurantTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < restaurants.length; i++) {
          let rowEntry = document.createElement("tr");

          let rowHTML = `
              <td>${restaurants[i].name}</td>
              <td>${restaurants[i].description}</td>
              <td>${restaurants[i].location}</td>
              <td>${restaurants[i].averageRating}</td>
              <td>
    <button type="button" class="addReview" data-id="${restaurants[i]._id}">Add Review</button>
  </td>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        restaurantTable.replaceChildren(...children);
      }
    } else {
      message.textContent = "Failed to load restaurants.";
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(restaurantsDiv);
};
