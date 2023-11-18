// /**    */
// const {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
//   ListObjectsV2Command,
//   DeleteObjectCommand,
// } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const s3Client = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
// });

// // before calling this function check if the user has access or not in both frontend and backend
// async function getObjectURL(key) {
//   const command = new GetObjectCommand({
//     Bucket: "tarundev.videos",
//     Key: key,
//   });
//   const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 }); // it will only valid till 24hours
//   return url;
// }

// // api call
// async function init1() {
//   // console.log("URL for ", await getObjectURL("Section1/videoThumb1.jpeg"));
//   console.log(
//     "URL for ",
//     await getObjectURL("user-uploads/image-1698944159934.jpeg") // it will generate a pre-signed-url
//   );
// }
// // init1();

// async function putObject(filename, contentType) {
//   const command = new PutObjectCommand({
//     Bucket: "tarundev.videos",
//     Key: `user-uploads/${filename}`,
//     ContentType: contentType,
//   });

//   const url = await getSignedUrl(s3Client, command);
//   return url;
// }

// // api call
// async function init2() {
//   console.log(
//     "URL for uploading ",
//     await putObject(`image-${Date.now()}.jpeg`, "image/jpeg") // it will generate a pre-signed-url
//   );
// }
// // init2();

// // it will list all the data inside the bucket
// // async function listObjects() {
// //   const command = new ListObjectsV2Command({
// //     Bucket: "tarundev.videos",
// //     Key: "/",
// //   });

// //   const result = await s3Client.send(command);
// //   console.log(result);
// // }

// // api call
// // async function init3() {
// //   await listObjects();
// // }
// // init3();

// // delete data from bucket
// // async function deleteObject() {
// //   const command = new DeleteObjectCommand({
// //     Bucket: "tarundev.videos",
// //     Key: "user-uploads/image-1698944159934.jpeg",
// //   });

// //   await s3Client.send(command);
// // }

// // deleteObject();

// /**    */
