import { Command } from '../../../protocol';

import CommandViewAdvanced from './view-advanced';
import CommandViewBasic from './view-basic';
import CommandViewRandomized from './view-randomized';
import CommandViewRole from './view-role';

export interface CommandViewProps {
    command: Command
    editing: boolean
    onClose: () => void
    onSave: (c: Command, name?: string) => void
}

export default function CommandView ({ command, editing, onClose, onSave }: CommandViewProps) {
    const LoadView = () => {
        switch(command.Type) {
            case 0: return <CommandViewBasic command={command} editing={editing} onClose={onClose} onSave={onSave}/>
            case 1: return <CommandViewRandomized command={command} editing={editing} onClose={onClose} onSave={onSave}/>
            case 3: return <CommandViewRole command={command} editing={editing} onClose={onClose} onSave={onSave}/>
            case 4: return <CommandViewAdvanced command={command} editing={editing} onClose={onClose} onSave={onSave}/>
            default: return <></>
        }
    }

    return LoadView()
}