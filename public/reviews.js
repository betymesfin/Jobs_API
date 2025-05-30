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

let jobsDiv = null;
let reviewsTable = null;
let reviewsTableHeader = null;

export const handleJobs = () => {
  jobsDiv = document.getElementById("jobs");
  const logoff = document.getElementById("logoff");
  const addReview = document.getElementById("add-job");
  reviewsTable = document.getElementById("jobs-table");
  reviewsTableHeader = document.getElementById("jobs-table-header");

  jobsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addReview) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        reviewsTable.replaceChildren([reviewsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        const reviewId = e.target.dataset.id;
        message.textContent = "";
        enableInput(false);

        try {
          const response = await fetch(`/api/v1/review/${reviewId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The review entry was deleted.";
            showJobs();
          } else {
            message.textContent = data.msg || "Failed to delete the review.";
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      }
    }
  });
};

export const showJobs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/review", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [reviewsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        reviewsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.reviews.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.reviews[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.reviews[i]._id}>delete</button></td>`;
          let rowHTML = `
              <td>${data.reviews[i].comment}</td>
              <td>${data.reviews[i].rating}</td>
              <td>${data.reviews[i].type}</td>
              <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        reviewsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(jobsDiv);
};
