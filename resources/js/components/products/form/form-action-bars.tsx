import { CancelButton, SaveButton } from '@/components/shared/action-buttons';
import { Kbd } from '@/components/ui/kbd';
import { router } from '@inertiajs/react';
import { type MouseEventHandler } from 'react';

interface ActionBarProps {
    mode: 'create' | 'edit';
    processing: boolean;
}

function useSaveLabel({ mode, processing }: ActionBarProps): string {
    
    if (processing) return "Saving...";

    return mode === 'create' ? "Create Product" : "Save Changes";
}

/** Cancel / Save row under the form (sm screens and up). Lives inside the `<form>`, so Save is a plain submit. */
export function DesktopActionBar(props: ActionBarProps) {
        const label = useSaveLabel(props);

    return (
        <div className="hidden items-center justify-between gap-2 border-t pt-4 sm:flex">
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
                to save
            </p>
            <div className="flex items-center gap-2">
                <CancelButton onClick={() => router.get(route('products.index'))} title={"Cancel"} />
                <SaveButton processing={props.processing} title={label} />
            </div>
        </div>
    );
}

/** Sticky Cancel / Save bar pinned to the bottom of small screens. Rendered outside the `<form>`, so Save calls `onSave`. */
export function MobileActionBar({ onSave, ...props }: ActionBarProps & { onSave: MouseEventHandler<HTMLButtonElement> }) {
        const label = useSaveLabel(props);

    return (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t p-3 shadow-lg backdrop-blur sm:hidden">
            <CancelButton onClick={() => router.get(route('products.index'))} title={"Cancel"} />
            <SaveButton processing={props.processing} onClick={onSave} title={label} className="flex-1" />
        </div>
    );
}
