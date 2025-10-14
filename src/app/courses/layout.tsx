import { RoleGuard } from "@/components/auth/role-guard";
import { UserPermission } from "@/types/auth";

interface CoursesLayoutProps {
  children: React.ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return (
    <RoleGuard
      requiredPermission={UserPermission.VIEW_PRODUCTS}
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access courses.
            </p>
          </div>
        </div>
      }
      showLoading={true}
    >
      {children}
    </RoleGuard>
  );
}
