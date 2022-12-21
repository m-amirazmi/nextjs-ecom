import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prismadb';
import { Category } from '../../../utils/interfaces';

type Data = {
	message?: string;
	data?: Category | Category[];
};

const reqMethod = {
	POST: create,
	GET: show,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	return await reqMethod[req.method as keyof typeof reqMethod](req, res);
}

async function create(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { name } = req.body;
	if (!name) return res.status(200).json({ message: 'Name field cannot be emptied!' });

	try {
		const data = await prisma.category.create({ data: { name } });
		return res.status(200).json({ message: 'Category created!', data });
	} catch (error) {
		console.error(error);
	}
}

async function show(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		const data = await prisma.category.findMany();
		return res.status(200).json({ data });
	} catch (error) {
		console.error(error);
	}
}
