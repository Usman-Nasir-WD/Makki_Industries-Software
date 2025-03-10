import { signInWithEmailAndPassword, GoogleAuthProvider , signInWithPopup} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import { auth } from "./firebaseconfig.js";

const provider = new GoogleAuthProvider();


const form = document.querySelector('#form');
const email = document.querySelector('#loginEmail');
const password = document.querySelector('#loginPassword');

form.addEventListener('submit', event => {
    event.preventDefault()
    console.log(email.value);
    console.log(password.value);
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location = "index.html"
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        }); 

})

const googleBtn = document.querySelector("#googleBtn");

googleBtn.addEventListener("click", () => {
 
   console.log("My Google Button");
 
   signInWithPopup(auth, provider)
   .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        window.location = "index.html";
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
 
})

