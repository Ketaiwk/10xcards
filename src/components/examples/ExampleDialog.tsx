import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function ExampleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example Dialog</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content and purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <p>This is the main content of the dialog. You can put any content here.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
