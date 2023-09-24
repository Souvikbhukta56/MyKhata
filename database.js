import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAe2LSZvMioVjcgcwDKMczd3im8HcXIvVQ",
    databaseURL: "https://my-khata-28996-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: 'my-khata-28996',
    appId: "1:32043139222:android:4f51a73bdca3b7c5c3c2b7" 
};
  
initializeApp(firebaseConfig);

const dbref = ref(getDatabase());

const storeData= (companyName, target, value) => {
    const db = getDatabase();
    const reference = ref(db, companyName + '/' + target);
    set(reference, value);
}

export {storeData, dbref};