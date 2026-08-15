import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import StaffForm from "./StaffForm";

function StaffModal({
                        open,
                        onOpenChange,
                        user,
                        onSuccess,
                    }) {

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-xl">

                <DialogHeader>

                    <DialogTitle>
                        {user
                            ? "Edit Staff"
                            : "Add Staff"
                        }
                    </DialogTitle>

                </DialogHeader>

                <StaffForm
                    user={user}
                    onSuccess={onSuccess}
                    onClose={() =>
                        onOpenChange(false)
                    }
                />

            </DialogContent>

        </Dialog>
    );
}

export default StaffModal;