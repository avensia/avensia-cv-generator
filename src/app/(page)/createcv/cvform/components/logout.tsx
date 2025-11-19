import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/services/auth.server';
import { LogOut } from 'lucide-react';

type PropsType = {
  buttonElement?: React.ReactNode;
};

export function LogoutAlert({ buttonElement }: PropsType) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {buttonElement ? (
          buttonElement
        ) : (
          <Button variant="secondary" className="mb-5" type="submit">
            <LogOut /> Logout
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={logout}>
            <AlertDialogAction type="submit">Continue</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
