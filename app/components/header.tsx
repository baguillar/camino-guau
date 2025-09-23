
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Home, 
  Trophy, 
  MapPin, 
  Star, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

export function Header() {
  const { data: session } = useSession() || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-yellow rounded-full">
              <span className="text-brand-dark font-bold text-xl">🐕</span>
            </div>
            <span className="text-2xl font-bold text-brand-dark">
              Camino <span className="text-brand-gold">Guau</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Home size={16} />
                    Dashboard
                  </Button>
                </Link>
                
                <Link href="/routes">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Rutas
                  </Button>
                </Link>

                <Link href="/ranking">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Trophy size={16} />
                    Ranking
                  </Button>
                </Link>

                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings size={16} />
                      Admin
                    </Button>
                  </Link>
                )}
              </nav>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={session?.user?.profileImage || ''} 
                        alt={session?.user?.name || 'Usuario'} 
                      />
                      <AvatarFallback className="bg-brand-yellow text-brand-dark">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session?.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="yellow">Registrarse</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            {session ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/routes" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Rutas
                  </Button>
                </Link>
                <Link href="/ranking" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Trophy className="mr-2 h-4 w-4" />
                    Ranking
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="yellow" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
