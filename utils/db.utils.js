const sdk = require("node-appwrite");
// const { ID } = require("node-appwrite");
const collectionID = "654130337fb1579d5008";
const dbID = "654124c15990e85465e1";

const start_db = () => {
  const client = new sdk.Client();
  const db = new sdk.Databases(client);

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("65411bd54e802ce23f29")
    .setKey(
      "64a95979c1875fc3fbe92dd1d9053e226792845c8b975d2ebed7fb863a8aa90b293ea19c8f5495f554b4d88f7e11a95287c3e02a4e731bb6e0721cf21394c9fe08be29868fdd6ddd1d66830ea1b3267853a159c9faf5ce1f1fc319174d21be6338e2ffd38c82047443d7510b01ef1ade887eb33a8221a1786e393b6a3737cbe8"
    );

  return db;
};

module.exports = { start_db };
