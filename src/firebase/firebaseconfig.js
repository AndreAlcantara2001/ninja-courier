import {initializeApp} from 'firebase/app'
import {
    getFirestore, 
} from 'firebase/firestore'
import {
    getAuth, 
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDEm3Ni6z3EHSLU4PDg6A8xhD3ul1ntH3E",
    authDomain: "ninjacourierdelivery.firebaseapp.com",
    projectId: "ninjacourierdelivery",
    storageBucket: "ninjacourierdelivery.appspot.com",
    messagingSenderId: "353673121114",
    appId: "1:353673121114:web:b8adcbe9d08099e6d4f763"
  };

  //init firebase
  initializeApp(firebaseConfig)

  //init firebase services
  const db = getFirestore()
  const auth = getAuth()

  //collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc, updateDoc

  export{
    auth, db
  }