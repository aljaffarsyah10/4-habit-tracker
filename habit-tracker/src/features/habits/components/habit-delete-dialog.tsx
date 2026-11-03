"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface HabitDeleteDialogProps {
  isOpen: boolean;
  habitName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function HabitDeleteDialog({
  isOpen,
  habitName,
  onClose,
  onConfirm,
}: HabitDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            <DialogTitle>Delete Habit</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{habitName}&quot;</span>?
            This will permanently remove the habit and all of its recorded completion history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

