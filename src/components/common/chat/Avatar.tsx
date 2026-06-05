import { Avatar, AvatarFallback } from "../../ui/avatar"
interface AvatarProps {
  firstName: string,
  lastName: string
}
export function AvatarPanel({ firstName, lastName }: AvatarProps) {
  return (
    <Avatar className="font-semibold ring-accent-sm mb-2">
      <AvatarFallback className="text-yellow-600">{firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
