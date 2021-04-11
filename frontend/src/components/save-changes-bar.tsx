import React from 'react'
import { Button, createStyles, makeStyles, Slide, Snackbar, Theme } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        saveBar: {
            width: '100%',
            [theme.breakpoints.down('xs')]: {
                width: '90vw',
                display: 'flex',
                left: '50%',
                transform: 'translateX(-50%)'
            }
        }
    })
)

export interface SaveChangesBarProps {
    open: boolean
    onCancel: () => void
    onSave: () => void
}

export default function SaveChangesBar ({ open, onCancel, onSave }: SaveChangesBarProps) {
    const classes = useStyles()

    return (
        <Snackbar 
        className={classes.saveBar}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={open}
        message='Careful! You have unsaved changes!'
        key='save_changes'
        TransitionComponent={Slide}>
            <Alert icon={false} style={{
                backgroundColor: '#161619ff', 
                color: 'white',
                height: '70px',      
                minWidth: '200px',
                }}>
                <div style={{height: '100%', display: 'flex', flexFlow: 'row', alignItems: 'center',}}>
                    <p>Careful, you have unsaved changes!</p>
                    <Button onClick={() => onCancel()} style={{marginLeft: '20px'}}>Cancel</Button>
                    <Button onClick={() => onSave()} style={{marginLeft: '10px', backgroundColor: '#43b581ff'}} color='inherit' variant='contained'>Save</Button>
                </div>
            </Alert>
        </Snackbar>
    )
}