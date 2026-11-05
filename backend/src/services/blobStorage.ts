import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'photos';

function getClient() {
  if (!accountName || !accountKey) {
    throw new Error('AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY must be set.');
  }
  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  return { client: new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential), credential };
}

export async function ensureContainerExists() {
  const { client } = getClient();
  const container = client.getContainerClient(containerName);
  await container.createIfNotExists();
}

export async function uploadPhoto(blobName: string, base64Data: string): Promise<void> {
  const { client } = getClient();
  const raw = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(raw, 'base64');
  const container = client.getContainerClient(containerName);
  const blockBlob = container.getBlockBlobClient(blobName);
  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'image/jpeg' },
  });
}

export function generateSasUrl(blobName: string, expiresInMinutes = 60): string {
  const { credential } = getClient();
  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      expiresOn,
      protocol: SASProtocol.Https,
    },
    credential
  ).toString();
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}
