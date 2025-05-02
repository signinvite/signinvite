import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), '../../whitelistedEmails.json');
// console.log(filePath);

// const filePath = path.join('packages/lib/server-only/user/whitelist-email.ts');
// console.log(filePath, '----234-3242');

export const AddWhitelistEmail = async ({ email }: { email: string }) => {
  try {
    const newData = { email, timestamp: new Date() };
    let fileExists = false;

    try {
      await fs.access(filePath);
      fileExists = true;
    } catch (err) {
      fileExists = false;
    }

    if (fileExists) {
      const existing = await fs.readFile(filePath, 'utf-8');
      let json: { email: string; timestamp: Date }[] = JSON.parse(existing);
      const isAlreadyExists = json.map((d) => d.email).some((e) => e == newData.email);

      if (Array.isArray(json)) {
        if (!isAlreadyExists) {
          json.push(newData);
        } else {
          return { message: 'Already Whitelisted Mail', status: true };
        }
      } else {
        json = [json, newData];
      }

      await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
    } else {
      await fs.writeFile(filePath, JSON.stringify([newData], null, 2), 'utf-8');
    }

    // console.log('✅ File written/appended successfully.');
    return { message: 'Added New Whitelisted Mail', status: true };
  } catch (error) {
    // console.error('❌ Error handling file:', error);
    return { message: 'Error Happened While Adding New Whitelisted Mail!!!', status: false };
  }
};

type PaginationParams = {
  page?: number; // Optional page number
  perPage?: number; // Optional items per page
  search?: string; // Optional search text
};

export const ViewAllWhitelistedEmail = async ({
  page = 1,
  perPage = 10,
  search = '',
}: PaginationParams = {}) => {
  try {
    try {
      await fs.access(filePath);
    } catch (err) {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
    }

    const data = await fs.readFile(filePath, 'utf-8');
    let json = JSON.parse(data);

    if (!Array.isArray(json)) {
      json = [json];
    }

    // 🧹 Search
    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      json = json.filter((entry: { email: string }) =>
        entry.email.toLowerCase().includes(lowerSearch),
      );
    }

    const totalItems = json.length;
    const totalPages = Math.ceil(totalItems / perPage);

    // 🎯 Pagination
    const paginatedData = json.slice((page - 1) * perPage, page * perPage);

    // console.log('✅ Retrieved whitelisted emails with pagination and search.');
    return {
      emails: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
      status: true,
    };
  } catch (error) {
    // console.error('❌ Error reading whitelist file:', error);
    return { message: 'Error happened while reading Whitelisted Mails!!!', status: false };
  }
};

export const DeleteWhitelistedMail = async ({ email }: { email: string }) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    let json = JSON.parse(data);

    if (!Array.isArray(json)) {
      json = [json];
    }

    const updatedList = json.filter((entry: { email: string }) => entry.email !== email);

    await fs.writeFile(filePath, JSON.stringify(updatedList, null, 2), 'utf-8');

    // console.log(`✅ Email "${email}" deleted from whitelist.`);
    return { message: 'Deleted Successfully!', status: true };
  } catch (error) {
    // console.error('❌ Error deleting whitelist email:', error);
    return { message: 'Error Happened While Deleting Whitelisted Mail!!!', status: false };
  }
};
