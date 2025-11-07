import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {

  await requireAuth();
  return (
    <div className="">
     Hi
    </div>
  );
};

export default Page;
