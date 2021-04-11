import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

interface StyleProps {
   scroll: boolean
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => 
    createStyles({
        textArea: {
            width: '100%',
            height: '300px', 
            borderRadius: '5px',
            backgroundColor: '#1c1d21ff',
            border: '2px solid #161619ff',
            outline: 'none',
            padding: '15px',
            fontSize: '15px',
            color: '#dedede',
            resize: 'none',
            fontFamily: 'Roboto'
        },
        textAreaExpandable: {
            width: '100%',
            minHeight: '100px',
            maxHeight: '300px',
            borderRadius: '5px',
            backgroundColor: '#1c1d21ff',
            border: '2px solid #161619ff',
            overflowY: ({scroll}) => scroll ? 'auto' : 'hidden',
            outline: 'none',
            padding: '15px',
            fontSize: '15px',
            color: '#dedede',
            resize: 'none',
            fontFamily: 'Roboto'
        }
    })
)

export interface TextAreaProps {
    value?: string | undefined
    style?: React.CSSProperties | undefined
    className?: string | undefined
    variant?: 'expandable' | undefined
    onChange?: (value: string) => void | undefined
}

export default function TextArea ({ value, style, className, variant, onChange }: TextAreaProps) {
    const [scroll, setScroll] = React.useState(false)
    const classes = useStyles({scroll: scroll})

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event.target.value)
        }
        if (variant === 'expandable') {
            event.target.style.height = 'auto'
            event.target.style.height = `${event.target.scrollHeight}px`
            setScroll(event.target.scrollHeight > 300)
        }
    } 

    return (
        <textarea 
        className={`${variant !== 'expandable' ? classes.textArea : classes.textAreaExpandable} ${className}`}
        style={style}
        value={value}
        onChange={handleChange}
        /> 
    )
}