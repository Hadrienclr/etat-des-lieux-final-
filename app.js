const DATABASE_NAME = "etat_des_lieux_v4";
const DATABASE_VERSION = 1;
const RECORDS_STORE = "records";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(RECORDS_STORE)) {
        database.createObjectStore(RECORDS_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveRecord(record) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(RECORDS_STORE, "readwrite");
    transaction.objectStore(RECORDS_STORE).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function readRecord(id) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(RECORDS_STORE).objectStore(RECORDS_STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function readAllRecords() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(RECORDS_STORE).objectStore(RECORDS_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function removeRecord(id) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(RECORDS_STORE, "readwrite");
    transaction.objectStore(RECORDS_STORE).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
