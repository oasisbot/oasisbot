import React from 'react'
import { makeStyles, createStyles, Theme, Switch, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        command: {
            position: 'relative',
            width: '100%',
            height: '100px',
            [theme.breakpoints.down('xs')]: {
                height: '70px'
            },
            display: 'flex',
            borderRadius: '5px',
            marginBottom: '15px',
            padding: '20px 25px',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 3px 15px 2px rgb(0, 0, 0, 20%)',
            backgroundColor: theme.palette.background.paper,
            transition: 'background-color 0.3s',
            border: '2px solid black',
            cursor: 'pointer',
            '& div': {
                position: 'relative',
                height: '100%', 
                display: 'flex',
                flex: '1 1 0px',
                flexFlow: 'column',
                justifyContent: 'center',
                overflow: 'hidden'
            },
            '& h2, & p': {
                margin: '0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
            '& p': {
                color: '#cccccc',
                maxWidth: '100%',
                [theme.breakpoints.down('xs')]: {
                    display: 'none'
                }
            },
            '&:hover': {
                backgroundColor: '#46474eff'
            }
        }       
    })
)

export interface CommandProps {
    name: string
    description: string | undefined
    enabled: boolean
    prefix: string
    onEnableChange: (enabled: boolean) => void
    onSelect: () => void
    onDelete: () => void
}

export default function Command ({name, description, enabled, prefix, onEnableChange, onSelect, onDelete}: CommandProps) {
    const classes = useStyles()
    const [checked, setChecked] = React.useState(enabled)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const handleToggle = () => {
        const value = !checked
        setChecked(value)
        onEnableChange(value)
    }

    const handleDeleteDialogClose = (yes: boolean = false) => {
        setDeleteDialogOpen(false)
        if (yes) onDelete()
    }

    return (
        <div className={classes.command}>
            <div onClick={onSelect}>
                <h2>{`${prefix}${name}`}</h2> 
                <p>{description ? description : 'No description provided'}</p>
            </div>
            <Switch defaultChecked={enabled} onChange={handleToggle}/>
            <IconButton size='medium' onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
            </IconButton>
            <Dialog
            open={deleteDialogOpen}
            onClose={() => handleDeleteDialogClose()}
            >
                <DialogTitle>Delete this command?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Command '${name}' will be deleted permanently.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDeleteDialogClose()}>Cancel</Button>
                    <Button onClick={() => handleDeleteDialogClose(true)}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}