// import { initializeApp } from "firebase/app";
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { firebaseConfig } = require("./config");

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const uploadImage = async (req, res) => {
  //   console.log(firebaseConfig);
    // console.log(req.files);
  if(!req.files || req.files=== undefined || req.files.length === 0) return res.status(400).send({status: false, message: "Please select the file again"})
  const dateTime = giveCurrentDateTime();

  const storageRef = ref(
    storage,
    `jogs/${req.files[0].originalname + "       " + dateTime}`
  );

  // Create file metadata including the content type
  const metadata = {
    contentType: req.files[0].mimetype,
  };

  // Upload the file in the bucket storage
  const snapshot = await uploadBytesResumable(
    storageRef,
    req.files[0].buffer,
    metadata
  );
  //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

  // Grab the public url
  const downloadURL = await getDownloadURL(snapshot.ref);

  //   console.log("File successfully uploaded.");
  return res.send({
    status: true,
    message: "file upload success",
    // name: req.files[0].originalname,
    // type: req.files[0].mimetype,
    downloadURL: downloadURL,
  });
};

module.exports = { uploadImage };
