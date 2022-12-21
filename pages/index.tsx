import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Category } from '../utils/interfaces';

type Inputs = {
	name: string;
};

export default function Homepage({ data }: any) {
	const { register, handleSubmit, watch } = useForm<Inputs>();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		if (!data || data.length === 0) return;
		setCategories(data);
	}, [data]);

	const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
		await axios.post('/api/categories', { name });
		getAllCategories();
	};

	const getAllCategories = async () => {
		const { data } = await axios.get('/api/categories');
		setCategories(data.data);
	};

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-gray-800">
			<div>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<input className="border bg-gray-800 p-2 text-gray-50" defaultValue="test" {...register('name')} />
					<input className="bg-gray-100 p-2" type="submit" />
				</form>
			</div>
			<div className="flex w-52 flex-col gap-2">
				{categories.map((i) => {
					return (
						<div className="w-full bg-blue-300 p-2 text-center" key={i.id}>
							{i.name}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { data } = await axios.get(process.env.HOST + '/api/categories');

	return {
		props: {
			data: data.data,
		},
	};
};
