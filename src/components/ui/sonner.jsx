"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-slate-800 group-[.toaster]:border-2 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:px-6 group-[.toaster]:py-4",
          description: "group-[.toast]:text-slate-600 group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-semibold group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2",
          success:
            "group-[.toaster]:border-primary group-[.toast]:text-primary",
          error:
            "group-[.toaster]:border-red-500 group-[.toast]:text-red-600",
          warning:
            "group-[.toaster]:border-amber-500 group-[.toast]:text-amber-600",
          info:
            "group-[.toaster]:border-blue-500 group-[.toast]:text-blue-600",
        },
      }}
      {...props} />
  );
}

export { Toaster }
