const FIREBASE_PROJECT_ID = "namonarayanaghee";
const query = {
  structuredQuery: {
    from: [{ collectionId: "abandoned_carts" }],
    where: {
      compositeFilter: {
        op: "AND",
        filters: [
          { fieldFilter: { field: { fieldPath: "notified" }, op: "EQUAL", value: { booleanValue: false } } },
          { fieldFilter: { field: { fieldPath: "recovered" }, op: "EQUAL", value: { booleanValue: false } } }
        ]
      }
    }
  }
};
fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`, {
  method: "POST",
  body: JSON.stringify(query)
}).then(res => res.json()).then(console.log).catch(console.error);
