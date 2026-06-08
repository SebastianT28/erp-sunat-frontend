import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas protegidas y sus roles requeridos
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard': ['contribuyente'],
  '/logistica': ['contribuyente'],
  '/operaciones': ['contribuyente'],
  '/gerenciaGeneral': ['administrador'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth_token')?.value;
  const rolCookie = request.cookies.get('auth_rol')?.value;
  // Normalizamos el rol a minúsculas por seguridad si existe
  const rol = rolCookie?.toLowerCase();

  // 1. Si el usuario está en /login pero YA tiene token, lo redirigimos a su panel
  if (pathname === '/login' && token && rol) {
    if (rol === 'administrador') {
      return NextResponse.redirect(new URL('/gerenciaGeneral', request.url));
    } else if (rol === 'contribuyente') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Comprobar si la ruta actual está protegida
  let requiredRoles: string[] | null = null;
  for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(route)) {
      requiredRoles = roles;
      break;
    }
  }

  // Si no está en ROUTE_ROLES, es una ruta pública (ej. /marketing o /login) o un asset estático
  if (!requiredRoles) {
    return NextResponse.next();
  }

  // 3. Si la ruta es protegida y no tiene token, al login
  if (!token || !rol) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Si la ruta es protegida pero su rol no está autorizado, al login (acceso denegado)
  if (!requiredRoles.includes(rol)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Si todo está correcto, permitir acceso
  return NextResponse.next();
}

// Configuración para definir en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas (root, dashboard, logistica, etc)
     * Excepto en las rutas de API, archivos estáticos (_next/static), 
     * imágenes (_next/image) y favicon.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
