import { TableClient, AzureNamedKeyCredential, odata } from '@azure/data-tables';
import bcrypt from 'bcryptjs';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';

function getCredential() {
  if (!accountName || !accountKey) {
    throw new Error('AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY must be set.');
  }
  return new AzureNamedKeyCredential(accountName, accountKey);
}

function getTableClient(tableName: string) {
  return new TableClient(
    `https://${accountName}.table.core.windows.net`,
    tableName,
    getCredential()
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserRecord {
  username: string;
  role: 'admin' | 'user';
  expiresAt: string; // ISO string or '' for never
  createdAt: string;
  createdBy: string;
}

export interface SessionRecord {
  id: string;
  username: string;
  effect: string;
  timestamp: string;
  originalBlobName: string;
  generatedBlobName: string;
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

export async function ensureTablesExist() {
  const usersClient = getTableClient('users');
  const sessionsClient = getTableClient('sessions');
  for (const client of [usersClient, sessionsClient]) {
    try {
      await client.createTable();
    } catch (err: unknown) {
      const azErr = err as { statusCode?: number };
      if (azErr.statusCode !== 409) throw err; // 409 = already exists
    }
  }
}

export async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;

  const client = getTableClient('users');
  try {
    await client.getEntity('users', username);
    // Already exists — skip
  } catch (err: unknown) {
    const azErr = err as { statusCode?: number };
    if (azErr.statusCode === 404) {
      const passwordHash = await bcrypt.hash(password, 12);
      await client.createEntity({
        partitionKey: 'users',
        rowKey: username,
        passwordHash,
        role: 'admin',
        expiresAt: '',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
      });
      console.log(`Admin user "${username}" created.`);
    } else {
      throw err;
    }
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

interface UserEntity {
  partitionKey: string;
  rowKey: string;
  passwordHash: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
}

export async function getUserByUsername(username: string): Promise<(UserRecord & { passwordHash: string }) | null> {
  const client = getTableClient('users');
  try {
    const entity = await client.getEntity<UserEntity>('users', username);
    return {
      username: entity.rowKey,
      passwordHash: entity.passwordHash,
      role: entity.role as 'admin' | 'user',
      expiresAt: entity.expiresAt || '',
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
    };
  } catch (err: unknown) {
    const azErr = err as { statusCode?: number };
    if (azErr.statusCode === 404) return null;
    throw err;
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  const client = getTableClient('users');
  const users: UserRecord[] = [];
  const iterator = client.listEntities<UserEntity>({
    queryOptions: { filter: odata`PartitionKey eq 'users'` },
  });
  for await (const entity of iterator) {
    users.push({
      username: entity.rowKey,
      role: entity.role as 'admin' | 'user',
      expiresAt: entity.expiresAt || '',
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
    });
  }
  return users.sort((a, b) => a.username.localeCompare(b.username));
}

export async function createUser(data: {
  username: string;
  password: string;
  role: 'admin' | 'user';
  expiresAt: string; // ISO string or '' for never
  createdBy: string;
}) {
  const client = getTableClient('users');
  const passwordHash = await bcrypt.hash(data.password, 12);
  await client.createEntity({
    partitionKey: 'users',
    rowKey: data.username,
    passwordHash,
    role: data.role,
    expiresAt: data.expiresAt,
    createdAt: new Date().toISOString(),
    createdBy: data.createdBy,
  });
}

export async function updateUserExpiry(username: string, expiresAt: string) {
  const client = getTableClient('users');
  await client.updateEntity(
    { partitionKey: 'users', rowKey: username, expiresAt },
    'Merge'
  );
}

export async function deleteUser(username: string) {
  const client = getTableClient('users');
  await client.deleteEntity('users', username);
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

interface SessionEntity {
  partitionKey: string;
  rowKey: string;
  username: string;
  effect: string;
  timestamp: string;
  originalBlobName: string;
  generatedBlobName: string;
}

export async function createSession(data: {
  username: string;
  effect: string;
  originalBlobName: string;
  generatedBlobName: string;
}) {
  const client = getTableClient('sessions');
  const now = new Date();
  const partitionKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const rowKey = `${now.toISOString().replace(/[:.]/g, '-')}_${data.username}`;
  await client.createEntity({
    partitionKey,
    rowKey,
    username: data.username,
    effect: data.effect,
    timestamp: now.toISOString(),
    originalBlobName: data.originalBlobName,
    generatedBlobName: data.generatedBlobName,
  });
  return rowKey;
}

export async function listSessions(limit = 200): Promise<SessionRecord[]> {
  const client = getTableClient('sessions');
  const sessions: SessionRecord[] = [];
  const iterator = client.listEntities<SessionEntity>();
  for await (const entity of iterator) {
    sessions.push({
      id: entity.rowKey,
      username: entity.username,
      effect: entity.effect,
      timestamp: entity.timestamp,
      originalBlobName: entity.originalBlobName,
      generatedBlobName: entity.generatedBlobName,
    });
    if (sessions.length >= limit) break;
  }
  return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
