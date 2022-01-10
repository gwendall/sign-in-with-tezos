import dynamic from 'next/dynamic';

const Page = dynamic(() => import('../pageComponents/Test'), {
  ssr: false,
});

export default Page;