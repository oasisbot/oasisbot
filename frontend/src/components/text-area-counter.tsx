import React from 'react'
import TextArea, { TextAreaProps } from './text-area'

import { makeStyles, createStyles, Theme } from '@material-ui/core'
import TextAreaCode from './text-area-code'

interface StyleProps {
    color: string,
    barWidth: number
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => 
    createStyles({
        parent: {
            display: 'flex',
            flexFlow: 'column'
        },
        textArea: {
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0'
        },
        barContainer: {
            height: '5px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            overflow: 'hidden'
        },
        bar: {
            height: '100%',
            transition: 'width 0.4s',
            width: ({barWidth}) => `${barWidth}%`,
            backgroundColor: ({color}) => color
        }
    })
)

export interface TextAreaCounterProps {
    maxLength: number
    textAreaProps: TextAreaProps
    color: string
    variant?: 'expandable' | 'code' | undefined
}

export default function TextAreaCounter ({maxLength, textAreaProps, color, variant = undefined}: TextAreaCounterProps) {
    const [charCount, setCharCount] = React.useState(textAreaProps.value?.length || 0)

    const classes = useStyles({color: color, barWidth: charCount / maxLength * 100})

    const handleChange = (value: string) => {
        if (value.length > maxLength) { return }
        setCharCount(value.length)
        if (textAreaProps.onChange) textAreaProps.onChange(value)
    }

    return (
        <div className={classes.parent}>
            <div className={classes.barContainer}>
                <div className={classes.bar} />
            </div>
            {variant !== 'code' ?
                <TextArea 
                value={textAreaProps.value} 
                variant={variant}
                style={textAreaProps.style} 
                className={`${textAreaProps.className} ${classes.textArea}`} 
                onChange={handleChange}/> :
                <TextAreaCode 
                value={textAreaProps.value || ''}
                onChange={handleChange}
                />
            }
        </div>
    )
}