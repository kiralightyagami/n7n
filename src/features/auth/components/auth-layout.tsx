import Link from "next/link";
import Image from "next/image";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    
    <div className="bg-mutex flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
     <Link href="/">
          <Image src="/icons/logo.svg" alt="Logo" width={35} height={35} />
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        {children}
      </div>
    </div>
  );
}