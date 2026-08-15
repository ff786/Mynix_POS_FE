import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import StaffForm from "./StaffForm";

function StaffModal({
    open,
    onOpenChange,
    user,
    onSuccess,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                        {user ? "Edit Staff" : "Add Staff"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        {user
                            ? "Update this staff member's account details."
                            : "Create a new staff account for MYNIX POS."}
                    </DialogDescription>
                </DialogHeader>

                <StaffForm
                    user={user}
                    onSuccess={onSuccess}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default StaffModal;