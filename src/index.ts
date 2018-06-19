import * as functions from 'firebase-functions'

import * as admin from 'firebase-admin'

admin.initializeApp()

import * as vision from '@google-cloud/vision'

import * as cookieParser from  'cookie-parser'
import * as crypto from  'crypto'
const OAUTH_REDIRECT_URI = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/popup.html`;
const OAUTH_SCOPES = 'basic';


const visionClient =  new vision.ImageAnnotatorClient();
// Dedicated bucket for cloud function invocation
const bucketName = 'orcamento-903c0.appspot.com';


export const identifyHairOnImages = functions.storage
    .bucket(bucketName)
    .object()
    .onFinalize(async (object) => {

        const imageUri = `gs://${bucketName}/${object.name}`;
        if (!object.contentType.startsWith('image/')) {
            console.log('This is not an image.');
            return null;
        }

        const results = await visionClient.labelDetection(`gs://${bucketName}/${object.name}`)
 
        const labels = results[0].labelAnnotations.map(obj => obj.description);
        // const docId = object.name.split('.jpg')[0];

       // const docRef  = admin.database().ref('/label/');
        
        // const hotdog = labels.includes('hot dog')

        // return docRef.set({ hotdog, labels })   

        const databaseRef = admin.database().ref("/cl_labels")

        return   databaseRef.set(labels);
});

 

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {

    console.log("coco");
 response.send("Hello from Firebase!");
});



