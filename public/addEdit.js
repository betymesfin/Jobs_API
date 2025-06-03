import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./reviews.js";

let addEditDiv = null;
let comment = null;
let rating = null;
let type = null;
let addingReview = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  comment = document.getElementById("comment");
  rating = document.getElementById("rating");
  type = document.getElementById("type");
  addingReview = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingReview) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/review";

        if (addingReview.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/review/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              comment: comment.value,
              rating: rating.value,
              type: type.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
            
              message.textContent = "The review entry was updated.";
            } else {
              message.textContent = "The review entry was created.";
            }

            comment.value = "";
            rating.value = "";
            type.value = "";
            showJobs();
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
        showJobs();
      }
    }
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    comment.value = "";
    rating.value = "";
    type.value = "Dine-In";
    addingReview.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
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
      console.log(data); 
      if (response.status === 200) {
        comment.value = data.review.comment;
        rating.value = data.review.rating;
        type.value = data.review.type;
        addingReview.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The reviews entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};
