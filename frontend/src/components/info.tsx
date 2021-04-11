import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        info: {
            width: '100%',
            minHeight: '50px',
            height: 'auto',
            display: 'flex',
            flexFlow: 'row',
            padding: '5px 15px',
            borderRadius: '5px',
            border: '1px solid #393a41ff',
            backgroundColor: '#393a4155',
            '& p': {
                color: '#dddddd'
            },
            '& a': {
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline'
                }
            }
        },
        leftSplit: {
            width: '40px',
            display: 'flex',
            marginTop: '10px'
        },
        rightSplit: {
            flex: '1'
        }
    })
)

export interface InfoProps {
    children?: JSX.Element
    style?: React.CSSProperties
}

export default function Info({ children, style }: InfoProps) {
    const classes = useStyles()
    return (
        <div className={classes.info} style={style}>
            <div className={classes.leftSplit}>
                <InfoOutlinedIcon />
            </div>
            <div className={classes.rightSplit}>
                {children}
            </div>
        </div>
    )
}