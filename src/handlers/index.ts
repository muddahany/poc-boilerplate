// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {
  HeadObjectCommand,
  HeadObjectCommandInput,
  //   PutObjectCommand,
  //   PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'us-east-1',
})

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let body: string | undefined
  if (event.isBase64Encoded) {
    const encodedRequestBody = event.body as string
    const decodedRequestBodyString = Buffer.from(encodedRequestBody, 'base64')
    body = decodedRequestBodyString.toString()
  } else {
    body = event.body as string
  }
  console.log('🚀 ~ file: index.ts:25 ~ body:', body)
  const Bucket = 's3-metadata-test-bucket'
  const params: HeadObjectCommandInput = {
    Bucket,
    Key: 'key',
  }

  try {
    const res = await s3Client.send(new HeadObjectCommand(params))
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    }
  }
}
