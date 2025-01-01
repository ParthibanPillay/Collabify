import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
    const [_open, setOpen] = useCreateWorkspaceModal();

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { data: workspace, isLoading:workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data:workspaces, isLoading:workspacesLoading } = useGetWorkspaces();

    const filterWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
                    {workspaceLoading ? (
                        <Loader className="size-5 animate-spin shrink-0"/>
                    ): (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                    <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)} 
                    className="cursor-pointer flex-col justify-start items-start capitalize">
                        {workspace?.name}
                        <span className="text-xs text-muted-foreground">Active workspace</span>
                    </DropdownMenuItem>
                    {filterWorkspaces?.map((workspace) => (
                        <DropdownMenuItem
                        key={workspace._id}
                        className="cursor-pointer capitalize overflow-hidden"
                        onClick={() => router.push(`/workspace/${workspace._id}`)}
                        >
                            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white text-lg rounded-md font-semibold flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="truncate">{workspace.name}</p>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                    >
                        <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 text-lg rounded-md font-semibold flex items-center justify-center mr-2">
                            <Plus/>
                        </div>
                        Create a Workspace
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};