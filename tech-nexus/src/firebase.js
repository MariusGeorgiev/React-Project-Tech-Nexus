import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBw03jPwD2NccCz_ysHMR0bz4DU0WhhwYw",
  authDomain: "technexus-react-project.firebaseapp.com",
  projectId: "technexus-react-project",
  storageBucket: "technexus-react-project.firebasestorage.app",
  messagingSenderId: "395944107949",
  appId: "1:395944107949:web:82dea050f52cf587e30b24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };