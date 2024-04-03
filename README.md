# CORS Test Server

This is a simple Node.js server that allows testing Cross-Origin Resource Sharing (CORS) headers for a given image URL.

## Prerequisites

- Node.js installed on your machine

## Installation

1. Clone the repository or copy the code into a new file, e.g., `corstest.js`.

2. Open a terminal and navigate to the directory where the `corstest.js` file is located.

3. Run the following command to start the server:

   ```
   node corstest.js
   ```

4. The server will start running at `http://localhost:3000/`.

## Usage

1. Open a web browser and navigate to `http://localhost:3000/`.

2. Provide the URL of an image you want to test for CORS headers in the `url` query parameter. For example:

   ```
   http://localhost:3000/?url=https://example.com/image.jpg
   ```

3. The server will display the image on the page and fetch the CORS headers for the image URL.

4. The CORS headers will be displayed below the image in a pre-formatted block.

## CORS Headers

The server will fetch and display the following CORS headers for the provided image URL:

- `Access-Control-Allow-Origin`: Specifies the origins that are allowed to access the resource.
- `Access-Control-Allow-Methods`: Specifies the HTTP methods that are allowed for the resource.
- `Access-Control-Allow-Headers`: Specifies the headers that are allowed in the request.
- `Content-Type`: Specifies the media type of the resource.

## Error Handling

If an error occurs while fetching the CORS headers, an error message will be displayed instead of the headers.

## Note

Make sure to provide a valid image URL in the `url` query parameter. The server does not perform any validation on the provided URL.

## License

This code is released under the [MIT License](https://opensource.org/licenses/MIT).

---

Feel free to customize the README file based on your specific requirements and add any additional information that you think would be helpful for users of your CORS test server.
