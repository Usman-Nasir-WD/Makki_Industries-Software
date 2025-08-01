import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

let userName = document.querySelector("#user-profile-name");
let userProfileImg = document.querySelector("#user-profile-img");
const logbtn = document.querySelector("#logout-btn1");
const showblogs = document.querySelector(".container");
let blogsarray = [];


onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log(auth.currentUser.uid); // Ya id current user k id hai jo login howa hia
    const uid = user.uid;

    console.log(uid);

    let userdata = await getDatafromfirebasedb();

    userName.innerHTML = userdata.fullName;

    userProfileImg.src = userdata.profileImg;

    let blogs = await getBlogsDataFromFirebaseDB();
    renderBlogOnScreen(blogs);
    let storedName = localStorage.getItem("updatedUserName");
    if (storedName) {
      userName.innerHTML = storedName; // Use updated name
      // localStorage.removeItem("updatedUserName"); // Remove to avoid reusing old name
    } else {
      userName.innerHTML = userData.userName;
    }
  }

  else { window.location = "login.html";}
});


async function getDatafromfirebasedb() {
  let user = null;
  const q = query(
    collection(db, "users"),
    where("uid", "==", auth.currentUser.uid)  
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    user = doc.data();
  });

  return user;
}


async function getBlogsDataFromFirebaseDB() {
  const q = query(collection(db, "usersblog"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  blogsarray = [];
  let counter = 0; // To limit the number of cards to 4

  querySnapshot.forEach((doc) => {
    if (counter < 5) {  // Only push the first 4 blogs
      blogsarray.push(doc.data());
      counter++;
    }
  });

  return blogsarray;
}


function renderBlogOnScreen(blogs) {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = ""; // Clear previous content

  blogs.forEach((res) => {
    let card = document.createElement("div");
        card.classList.add("card", "shadow-lg", "border-0", "rounded-4", "overflow-hidden");

        let cardInner = document.createElement("div");
        cardInner.classList.add("card-body");
      // cardInner.style.width = "80%";
      // cardInner.style.maxWidth = "550px";
      // cardInner.style.minHeight = "100px";

      let titleHtml = res.title
          ? `<h5 class="card-title fw-bold text-dark">Full Name: ${res.title}</h5>`
          : "";

      let ageHtml = res.age
          ? `<h5 class="fw-bold mb-1">Age : ${res.age}</h5>`
          : "";    

      let descriptionHtml = res.description
          ? `<p class="card-text text-muted small" style="white-space: pre-line;"><h6><u>Patient Madiciens</u> ⬇</h6>${res.description.replace(/\n/g, '<br>')}</p>`
          : "";

      let daysHtml = res.days
          ? `<p class="card-text fw-bold" id="text-yellow">📅 Days:"${res.days}"</p>`
          : "";
    
      let puryaHtml = res.purya
          ? `<p class="card-text fw-bold" id="text-orangered">🍚 Purya: "${res.purya}"</p>`
          : "";
    
      let bottleHtml = res.bottle
          ? `<p class="card-text fw-bold" id="text-peach">🍶 Syrup in "${res.bottle}" Aunce.</p>`
          : "";
    
      let majoonHtml = res.majoon
          ? `<p class="card-text fw-bold text-secondary">🔳 Majoon in "${res.majoon}" Tola.</p>`
          : "";

      let priceHtml = res.price
          ? `<p class="card-text fw-bold text-success">💸 Rs: ${res.price}/=</p>`
          : "";

      let phoneHtml = res.phoneNumber
          ? `<p class="card-text fw-bold text-primary">📲 ${res.phoneNumber}</p>`
          : "";
          

      let createdAt = res.createdAt
          ? new Date(res.createdAt.seconds * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
          : "Unknown Date";

      // Constructing the card body with dynamically inserted values
      let cardBodyHtml = `
          <div class="card-body d-flex flex-column justify-content-center p-4" style="width: 100%;">  
            <div>
                ${titleHtml}
                ${ageHtml}
                ${descriptionHtml}
            </div>
              <div class="d-flex gap-3">
                ${daysHtml}
                ${puryaHtml}
              </div>
              <div class="d-flex gap-3">
                ${bottleHtml}
                ${majoonHtml}
              </div>  
              ${priceHtml}
              ${phoneHtml}
              <p class="text-danger small mb-2" style="font-size: 12px;"> The patient came on: ${createdAt}</p>
          </div>
      `;

      if (titleHtml || age || descriptionHtml || priceHtml || phoneHtml || daysHtml || puryaHtml || bottleHtml || majoonHtml) {
          cardInner.innerHTML = cardBodyHtml;  // Insert HTML content
          card.appendChild(cardInner);
          blogContainer.appendChild(card);
      }
  });

}

renderBlogOnScreen(blogsarray);



logbtn.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("user Sign-out successful ");
      window.location = "login.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
});


// Mode button function
  document.addEventListener("DOMContentLoaded", function () {
      const darkModeToggle = document.getElementById("dark-mode-toggle");
      const body = document.body;
      const icon = darkModeToggle.querySelector("i");
      const text = darkModeToggle.querySelector("span");

      // Check if dark mode is enabled in localStorage
      if (localStorage.getItem("darkMode") === "enabled") {
          body.classList.add("dark-mode");
          darkModeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
          icon.classList.replace("fa-moon", "fa-sun");
          text.textContent = "Light Mode";
      }
  
    darkModeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
          // Save user preference
          if (body.classList.contains("dark-mode")) {
              localStorage.setItem("darkMode", "enabled");
              darkModeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
              icon.classList.replace("fa-moon", "fa-sun");
              text.textContent = "Light Mode";
          } else {
              localStorage.setItem("darkMode", "disabled");
              darkModeToggle.classList.replace("btn-outline-light", "btn-outline-dark");
              icon.classList.replace("fa-sun", "fa-moon");
              text.textContent = "Dark Mode";
          }
      });
  });
  


var tl = gsap.timeline()

tl.from('.logo-animation', {
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 1.5
});

tl.from('.nav-animation', {
    y: -30,
    opacity: 0,
    duration: 1,
    // delay: 0.5,
    // stagger: 0.5
});

tl.from('.cards-animation', {
    y: 30,
    opacity: 0,
    duration: 2,
    scale: 0.6,
});
