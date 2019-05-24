import {AwsClient} from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: process.env.KEY,
  secretAccessKey: process.env.SECRET
})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const bucket = "cfredirect"
  url.hostname = `${bucket}.s3.amazonaws.com`

  let resp

  switch (request.method) {
    // it is recommended to use put in place of post requests
    case "PUT":
      if (url.pathname.endsWith("html"||"js"||"css"||"txt")) {
        const body = await request.text()
        resp = await aws.fetch(url, { method: "PUT", body})
      }
      if (url.pathname.endsWith("png"||"jpg")) {
        const body = await request.blob()
        resp = await aws.fetch(url, {method: "PUT", body})
      }
      break;
    case "POST":
      resp = new Response("Please use PUT instead of POST")
      break;
    case "DELETE":
        // delete the item at the specified endpoint
        resp = await aws.fetch(url, {method: "DELETE"})
        break;
    default:
      // get by default
      resp = await aws.fetch(url)
      break;
  }

  return resp
}