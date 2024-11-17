import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export const authenticateUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe(); // Stop listening after the initial authentication
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then(() => {
            // The onAuthStateChanged listener will catch this change
          })
          .catch((error) => {
            unsubscribe();
            reject(error);
          });
      }
    });
  });
};
