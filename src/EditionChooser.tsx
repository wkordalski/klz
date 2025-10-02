import { useRef } from "react";
import { Edition } from "./edition";

export function EditionChooser({ editions, edition, setEdition }: { editions: Edition[], edition: Edition | null, setEdition: (edition: Edition) => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    if (edition === null) {
        return <span>(wybierz edycję)</span>;
    } else {
        return <>
            <dialog ref={dialogRef}>
                <div style={{marginBottom: '12px', fontWeight: 'bold'}}>Wybierz edycję konkursu</div>
                <div>
                    {editions.map(edition => <EditionChooserItem key={edition.name} edition={edition} onClick={() => {setEdition(edition); dialogRef.current?.close(); }} />)}
                </div>
            </dialog>
            <span
              onClick={() => {dialogRef.current?.showModal();}}
              style={{cursor: 'pointer'}}
            >{edition.name}</span>
        </>
    }
}

function EditionChooserItem({ edition, onClick }: { edition: Edition, onClick: () => void }) {
    const border = edition.active ? '1px solid #000000' : '1px dotted #444444';
    const color = edition.active ? '#000000' : '#777777';
    return <div onClick={onClick} style={{cursor: 'pointer', border, color, borderRadius: '4px', padding: '4px', float: 'left', margin: '4px' }}>{edition.name}</div>
}
