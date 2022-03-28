# NO WAR Extension

NO WAR Extension is a cross-platform browser extension for filtering war-related images. It is based on [TensorFlow.js](https://www.tensorflow.org/js) and the [MobileNetV2](https://arxiv.org/abs/1801.04381) architecture.

## How to run

In order to install the dependencies and the extension, run the following commands:

```shell
npm install
npm run start:${BROWSER}
```
where `$BROWSER` is either `firefox` or `chromium`.

## Performance

The performance of the current implementation isn't convincing enough to use the extension reliably. It's a bit faster on Chromium-based browsers and rather slow on Firefox. Other browsers haven't been tested by me. In either case, there is a noticeable delay between the DOM being rendered and the images being replaced.
