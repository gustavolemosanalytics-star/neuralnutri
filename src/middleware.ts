export { auth as middleware } from "@/auth"

export const config = {
    matcher: ["/dashboard/:path*", "/dieta/:path*", "/nutri-portal/:path*", "/ranking/:path*", "/vision-ai/:path*"],
}
