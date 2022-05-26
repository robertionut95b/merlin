import type { Permission } from "@prisma/client";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { UserWithRole } from "~/services/auth/auth.server";

interface AuthContextProps {
  user: UserWithRole | null | undefined;
  permissions: Permission[];
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  permissions: [],
});

interface AuthProviderProps extends AuthContextProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
  user,
  permissions,
}: AuthProviderProps) => {
  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        permissions: permissions || [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
