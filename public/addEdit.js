import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showReviews } from "./reviews.js";

let addEditDiv = null;
let comment = null;
let rating = null;
let type = null;
let addingReview = null;
let currentRestaurantId = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-review");
  comment = document.getElementById("comment");
  rating = document.getElementById("rating");
  type = document.getElementById("type");
  addingReview = document.getElementById("adding-review");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingReview) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/review";
        const isUpdate = addingReview.textContent === "update";

        if (isUpdate) {
          method = "PATCH";
          url = `/api/v1/review/${addEditDiv.dataset.id}`;
        }

        const body = {
          comment: comment.value,
          rating: rating.value,
          type: type.value,
        };

        if (!isUpdate && currentRestaurantId) {
          body.restaurant = currentRestaurantId;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            message.textContent =
              response.status === 200
                ? "The review entry was updated."
                : "The review entry was created.";

            comment.value = "";
            rating.value = "";
            type.value = "";
            showReviews();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showReviews();
      }
    }
  });
};

export const showAddEdit = async (jobId, restaurantId = null) => {
  currentRestaurantId = restaurantId;

  if (!jobId) {
    // Adding new review
    comment.value = "";
    rating.value = "";
    type.value = "Dine-In";
    addingReview.textContent = "add";
    message.textContent = "";
    setDiv(addEditDiv);
  } else {
    // Editing existing review
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/review/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        comment.value = data.review.comment;
        rating.value = data.review.rating;
        type.value = data.review.type;
        addingReview.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;
        setDiv(addEditDiv);
      } else {
        message.textContent = "The review entry was not found.";
        showReviews();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error has occurred.";
      showReviews();
    }

    enableInput(true);
  }
};
