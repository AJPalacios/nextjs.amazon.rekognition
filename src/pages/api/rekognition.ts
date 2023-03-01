// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DetectTextCommand, DetectTextCommandInput, DetectTextResponse, RekognitionClient, RekognitionClientConfig } from '@aws-sdk/client-rekognition';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const config: RekognitionClientConfig = {
        region: "us-west-2",
        credentials: {
            accessKeyId: "AKIARBAIMQYSUE5GLOWV",
            secretAccessKey: "KWzflYSbs1frTfhTO+vdUd0wkmjYJAZw2mzXhJJ6",
        }
    };
    const uint =  Buffer.from(req.body.replace(/^[\w\d;:\/]+base64\,/g, ''), 'base64');
    const input: DetectTextCommandInput = {
        Image: {
            Bytes: uint
        }
    }
    const client = new RekognitionClient(config);
    const command = new DetectTextCommand(input);
    const response: DetectTextResponse = await client.send(command);
    console.log(response);
    res.status(200).json({ text: response.TextDetections })
}
