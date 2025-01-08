import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JSX, useState } from "react";

export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setpromise] = useState<{resolve: (value: boolean) => void} | null>(null)

    const confirm = () => new Promise((resolve,reject) => {
        setpromise({ resolve });
    });

    const handleClose = () => {
        setpromise(null);
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const confirmDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [confirmDialog, confirm];
}