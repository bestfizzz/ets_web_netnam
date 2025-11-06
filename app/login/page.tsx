import { LoginForm } from "@/components/login/login-form";

export default function Page() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative overflow-hidden"
      style={{
        backgroundColor: "#f9fafb",
      }}
    >
      {/* ✅ Full-screen rotated pattern background */}
      <div
        className="bg-[length:12rem_6rem] sm:bg-[length:16rem_8rem] lg:bg-[length:21rem_9rem] absolute left-1/2 top-1/2 opacity-10 w-[200%] h-[250%] -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundImage: "url(/logo/small-logo-netnam-padding.png)",
          backgroundRepeat: "repeat space",
          transform: "rotate(45deg)",
          transformOrigin: "center",
        }}
      />

      {/* ✅ Centered Content */}
      <div className="relative z-10 w-full max-w-sm">
        <img
          className="mx-auto pl-2 mb-3 object-contain"
          src="/logo/small-logo-netnam.png"
          alt="Logo"
        />
        <LoginForm />
      </div>
    </div>
  );
}
