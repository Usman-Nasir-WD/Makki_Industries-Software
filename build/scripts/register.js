import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import { auth, db } from "./firebaseconfig.js";

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


const form = document.querySelector('#form');
const email = document.querySelector('#registerEmail');
const password = document.querySelector('#registerPassword');
const fullName = document.querySelector('#fullName');
const showError = document.querySelector(`#showError`);
let userProfilePicUrl = ""


let myWidget = cloudinary.createUploadWidget({
  cloudName: 'dz67bjplm', 
  uploadPreset: 'Upload Image'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        userProfilePicUrl = result.info.secure_url
        console.log(userProfilePicUrl)
      }
    }
  )
  
  document.getElementById("upload_widget").addEventListener("click", function(event){
    event.preventDefault()
      myWidget.open();
    }, false);  

    

form.addEventListener('submit',(e)=>{
     e.preventDefault();
    createUserWithEmailAndPassword(auth, email.value, password.value)

  .then( async (userCredential) => {
    const user = userCredential.user;
    console.log(user.uid);
    try {
        const docRef = await addDoc(collection(db, "users"), {
            fullName: fullName.value,
            email: email.value,
            uid: user.uid,
            profileImg:userProfilePicUrl,
            createdAt: new Date(),
        });
     window.location = 'login.html'
        console.log("Document written with ID are: ", docRef.id);
    } 
    catch (e) {
        console.error("Error adding document: ", e);
    }

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    showError.innerHTML = errorCode
    showError.innerHTML = errorMessage
    console.log(errorCode);
    console.log(errorMessage);
  });
})
