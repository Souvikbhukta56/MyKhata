import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set} from 'firebase/database';

const firebaseConfig = {
    apiKey: "Your Firebase api key",
    databaseURL: "Your Firebase database url",
    projectId: 'Your Firebase project id',
    appId: "Your Firebase app id" 
};
  
initializeApp(firebaseConfig);

const dbref = ref(getDatabase());

const storeData= (companyName, target, value) => {
    const db = getDatabase();
    const reference = ref(db, companyName + '/' + target);
    set(reference, value);
}

export {storeData, dbref};
