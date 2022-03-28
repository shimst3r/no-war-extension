/*
Copyright 2022 Nils Müller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as browser from "webextension-polyfill";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { CLASSES } from "./classes";

const MIN_HEIGHT = 100;
const MIN_WIDTH = 100;
const NO_WAR_URL = browser.runtime.getURL("assets/no_war.svg");

/**
 * filter an image based on model predictions if it contains labels
 * corresponding to war.
 * @param {HTMLImageElement} img
 * @param {Array<Object>} predictions
 */
function filter(img, predictions) {
  // A positive match is found if at least one className is included in CLASSES
  const positive_matches = predictions.filter((prediction) =>
    CLASSES.includes(prediction.className)
  );
  if (positive_matches.length > 0) {
    img.src = NO_WAR_URL;
    img.srcset = NO_WAR_URL;
  }
}

/**
 * process computes predictions for a given image using the model and delegates
 * content management to the filter function.
 * @param {mobilenet.MobileNet} model
 * @param {HTMLImageElement} img
 */
function process(model, img) {
  model
    .classify(img, 10)
    .then((predictions) => filter(img, predictions))
    .catch((err) => console.log(err));
}

/**
 * main retrieves all img tags on a given web page, filters for images of a
 * certain size (to reject e.g. favicons), and removes war-related images based
 * on classification results.
 */
function main() {
  const imgs = Array.from(document.getElementsByTagName("img"));
  imgs
    .filter((img) => img.height > MIN_HEIGHT || img.width > MIN_WIDTH)
    .forEach((img) => {
      img.crossOrigin = "anonymous";
      mobilenet
        .load({ version: 2, alpha: 0.5 })
        .then((model) => process(model, img))
        .catch((err) => console.log(err));
    });
}

main();
