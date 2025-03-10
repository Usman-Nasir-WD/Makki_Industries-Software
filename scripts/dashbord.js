import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";  

// Track the post being edited
let editingPostId = null; // This will store the post ID if we're editing

// Adding a new post or editing an existing one
const form = document.querySelector("#form");
let userDataArray = [];


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const title = document.querySelector("#title").value.trim();
  const age = document.querySelector("#age").value.trim();
  const description = document.querySelector("#description").value.trim();
  const phoneNumber = document.querySelector("#contactNumber").value.trim();
  const price = document.querySelector("#price").value.trim();
  const days = document.querySelector("#days").value.trim();
  const purya = document.querySelector("#purya").value.trim();
  const bottle = document.querySelector("#bottle").value.trim();
  const majoon = document.querySelector("#majoon").value.trim();

  if (!title || !age || !description || !phoneNumber || !price || !days || !purya || !bottle || !majoon) {
      alert("Please fill in all fields!");
      return;
  }

  try {
    if (editingPostId) {
        const postRef = doc(db, "usersblog", editingPostId);
        await updateDoc(postRef, {
            title: title,
            age: age,
            description: description,
            phoneNumber: phoneNumber,
            price: price,
            days: days,
            purya: purya,
            bottle: bottle,
            majoon: majoon,
            updatedAt: new Date(),
        });
        console.log("Post updated!");
    } else {
        await addDoc(collection(db, "usersblog"), {
            title: title,
            age: age,
            description: description,
            phoneNumber: phoneNumber,
            price: price,
            days: days,
            purya: purya,
            bottle: bottle,
            majoon: majoon,
            createdAt: new Date(),
            uid: auth.currentUser.uid,
            profileImg: "https://via.placeholder.com/150", 
        });
        console.log("Document written!");
    }

     // Reset form and exit edit mode
     form.reset();
     editingPostId = null; // Reset edit mode
 
     // Re-render the posts to reflect the changes or add the new post
     renderloginUserblogs(userDataArray); // Re-render the list of posts after edit
 
     // Redirect to the home page (index.html) after 500ms
     window.location.href="index.html"

  } catch (e) {
    console.error("Error submitting form: ", e);
  }
});


// Auth state change listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);
    const userValue = await loginUserData(user.uid);
    renderloginUserblogs(userValue);
  } else {
    console.log("No user is logged in.");
    window.location = "login.html";  // Redirect to login if no user is logged in
  }
});

// Fetching user blogs from Firestore
async function loginUserData(uid) {
  userDataArray = [];
  try {
    const q = query(collection(db, "usersblog"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      userDataArray.push({ ...post, id: doc.id });
    });
    return userDataArray;
  } catch (e) {
    console.error("Error fetching user blogs: ", e);
  }
}




// Get the hideContainer, search bar, and card container elements
const hideContainer = document.querySelector("#hideContainer");
const searchInput = document.querySelector("#search-bar");
const cardContainer = document.getElementById("card-container");

// Initially hide all cards when the page is loaded or refreshed
hideContainer.style.display = "none";  // Hide the container by default


// Event listener for the search input
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  if (query !== "") {
    // If the user types something in the search bar, show the container and filter the cards
    hideContainer.style.display = "block"; // Show the container

    // Filter the data based on the search query (case-insensitive)
    const filteredData = userDataArray.filter(post => 
      post.title.toLowerCase().startsWith(query)

      // Using startWith for a first word match.
      // Using includes for a more flexible match.
    );

    // Clear the card container and render the filtered data
    cardContainer.innerHTML = "";
    renderloginUserblogs(filteredData);
  } else {
    // If the search query is empty, hide the container and clear the cards
    hideContainer.style.display = "none";  // Hide the container
    cardContainer.innerHTML = "";  // Optionally clear the cards
  }
});




// Function to render the user blo
async function renderloginUserblogs(userData) {
  cardContainer.innerHTML = "";  // Clear previous posts before rendering

  if (userData.length === 0) {
    cardContainer.innerHTML = "<p class='text-center text-muted no-name-error'>There is no patient by this name. 🧐 <br /> Please Try again with a correct spalling...😇 </p>";
  }

  userData.forEach((post) => {
    const createdAt = new Date(post.createdAt.seconds * 1000).toLocaleString();

    const cardHTML = `
    <div class="col-lg-10 col-md-12 col-sm-12 d-flex justify-content-center mb-4 card">
        <div class="card shadow-lg border-0 rounded-3 overflow-hidden d-flex flex-column" style="width: 100%;">
            <div class="card-body d-flex flex-column justify-content-center p-3" style="width: 100%; background-color: #f9f9f9;">
                <h5 class="card-title fw-bold text-dark mb-1">Full Name: ${post.title || "Untitled Post"}</h5>
                <h6 class="fw-bold mb-1" style="font-size: 18px;">Age: ${post.age}</h6>
                <p class="card-text text-muted mb-1" style="font-size: 12px; line-height: 1.2;">
                    <h6><span class="fw-bold mb-1" style="font-size: 12px;">Patient Medications ⬇</span></h6>  
                    ${post.description.replace(/\n/g, '<br>')}
                </p>
                <p class="card-text fw-bold text-yellow mb-1" style="font-size: 14px;">📅 Days: ${post.days}</p>
                <p class="card-text fw-bold text-orangered mb-1" style="font-size: 14px;">🍚 Purya: ${post.purya}</p>
                <p class="card-text fw-bold text-peach mb-1" style="font-size: 14px;"> 🍶 Syrup in "${post.bottle}" Aunce.</p>
                <p class="card-text fw-bold text-secondary mb-1" style="font-size: 14px;">🔳 Majoon in "${post.majoon}" Tola.</p>
                <p class="card-text fw-bold text-success mb-1" style="font-size: 14px;">💸 Rs: ${post.price}</p>
                <p class="card-text fw-bold text-primary mb-1" style="font-size: 14px;">📲 Contact Number: ${post.phoneNumber}</p>
                <p class="text-danger small mb-2" style="font-size: 12px;">The patient came on this date: ${createdAt}</p>
                <button class="btn btn-outline-success btn-sm edit-btn" data-id="${post.id}">Edit</button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${post.id}">Delete</button>
            </div>
        </div>
    </div>`;

    cardContainer.innerHTML += cardHTML;
  });

  // Add event listeners for Edit and Delete buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', handleEdit);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', handleDelete);
  });
}




// Handle editing the post

async function handleEdit(e) {
  const postId = e.target.getAttribute('data-id'); // Get the post ID from the clicked button
  const post = userDataArray.find(p => p.id === postId); // Find the post data by ID

  // Set the editingPostId to indicate we are in "edit" mode
  editingPostId = postId;

  // Fill the form fields with the existing post data
  document.querySelector("#title").value = post.title;
  document.querySelector("#age").value = post.age;
  document.querySelector("#description").value = post.description;
  document.querySelector("#contactNumber").value = post.phoneNumber;
  document.querySelector("#price").value = post.price;
  document.querySelector("#days").value = post.days;
  document.querySelector("#purya").value = post.purya;
  document.querySelector("#bottle").value = post.bottle;
  document.querySelector("#majoon").value = post.majoon;

}



// Handle deleting the post
async function handleDelete(e) {
  const postId = e.target.getAttribute('data-id');
  const postRef = doc(db, "usersblog", postId);
  try {
    await deleteDoc(postRef);
    console.log("Post deleted!");
    window.location.reload();
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}
