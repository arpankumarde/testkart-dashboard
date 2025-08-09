const Page = async ({ params }: { params: Promise<{ cid: string }> }) => {
  const { cid } = await params;

  return <div>{cid}</div>;
};

export default Page;
