import { CardGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsuariosLoading() {
    return (
        <div>
            <div>
                <div>
                    <Skeleton />
                    <Skeleton />
                </div>
                <Skeleton />
            </div>

            <CardGridSkeleton count={6} />
        </div>
    );
}
