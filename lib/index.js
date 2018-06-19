"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
// Dedicated bucket for cloud function invocation
const bucketName = 'orcamento-903c0.appspot.com';
exports.identifyHairOnImages = functions.storage
    .bucket(bucketName)
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    const imageUri = `gs://${bucketName}/${object.name}`;
    if (!object.contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }
    const results = yield visionClient.labelDetection(`gs://${bucketName}/${object.name}`);
    const labels = results[0].labelAnnotations.map(obj => obj.description);
    // const docId = object.name.split('.jpg')[0];
    // const docRef  = admin.database().ref('/label/');
    // const hotdog = labels.includes('hot dog')
    // return docRef.set({ hotdog, labels })   
    const databaseRef = admin.database().ref("/cl_labels");
    return databaseRef.set(labels);
}));
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log("coco");
    response.send("Hello from Firebase!");
});
//# sourceMappingURL=index.js.map