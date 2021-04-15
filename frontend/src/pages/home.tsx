import { 
    makeStyles, 
    createStyles, 
    Theme
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { height: '100%' },
        paper: { padding: theme.spacing(2) }
    })
);

export const Home = () => {
    const classes = useStyles()
    return <div className={classes.root} />
}