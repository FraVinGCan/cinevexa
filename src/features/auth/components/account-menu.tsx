import { useState } from 'react'
import { Link } from 'react-router'
import { LogInIcon, LogOutIcon, UserRoundIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { imageUrl } from '@/lib/tmdb/image'
import { beginSignIn, signOut } from '../auth.actions'
import { useAuthStore } from '../auth.store'

export function AccountMenu() {
  const status = useAuthStore((state) => state.status)
  const username = useAuthStore((state) => state.username)
  const avatarPath = useAuthStore((state) => state.avatarPath)
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (status !== 'authenticated') {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={status === 'authenticating'}
        onClick={() => void beginSignIn()}>
        <LogInIcon />
        <span className="hidden sm:inline">
          {status === 'authenticating' ? 'Connecting…' : 'Connect'}
        </span>
        <span className="sm:hidden">Sign in</span>
      </Button>
    )
  }

  const avatarUrl = imageUrl(avatarPath, 'w45')
  const fallback = username?.slice(0, 1).toUpperCase() ?? 'T'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open account menu" />
        }>
        <Avatar size="sm">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Connected as {username}</DropdownMenuLabel>
          <DropdownMenuItem render={<Link to="/account" />}>
            <UserRoundIcon />
            My library
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/lists" />}>
            <UserRoundIcon />
            Custom lists
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={() => {
            setIsSigningOut(true)
            void signOut().finally(() => setIsSigningOut(false))
          }}>
          <LogOutIcon />
          {isSigningOut ? 'Disconnecting…' : 'Disconnect'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
