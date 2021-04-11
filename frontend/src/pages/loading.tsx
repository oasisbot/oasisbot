import { makeStyles, createStyles, Theme, Avatar } from '@material-ui/core'

import Dots from '../components/dots'
import Logo from '../assets/logo192.png'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        errGroup: {
            position: 'absolute',
            top: 'calc(50% + 60px)',
            transform: '-50%',
            color: '#555555',
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
            '& h1, & h3': {
                margin: 0,
            },
            '& h3': {
                color: '#777777',
                fontWeight: 'normal'
            }
        },
        avatar: {
            width: '60px',
            height: '60px',
            boxShadow: '0px 6px 10px 1px rgb(0, 0, 0, 20%)',
            cursor: 'pointer'
        }
    })
)

export interface LoadingProps {
    error?: string | undefined
}

export default function Loading ({ error = undefined}: LoadingProps) {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            {error ?
                <>
                <Avatar className={classes.avatar} src={Logo} variant='circle'/> 
                <div className={classes.errGroup}>
                    <h1>WHOOPS!</h1>
                    <h3>{error}</h3>
                </div>
                </>
            : <Dots />}
        </div>
    )
}