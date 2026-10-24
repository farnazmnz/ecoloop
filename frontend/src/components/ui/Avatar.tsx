import type { User } from "@/lib/types";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
  "2xl": "h-24 w-24 text-3xl",
};

export function Avatar({
  user,
  size = "md",
  className = "",
  ring = false,
}: {
  user: Pick<User, "name" | "initials" | "avatarColor" | "photoURL">;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}) {
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white ${SIZES[size]} ${
    ring ? "ring-4 ring-white shadow-md" : ""
  } ${className}`;
  if (user.photoURL) {
    return <img src={user.photoURL} alt={user.name} className={`${base} object-cover`} />;
  }
  return (
    <span className={`${base} ${user.avatarColor}`} aria-label={user.name} role="img">
      {user.initials}
    </span>
  );
}
