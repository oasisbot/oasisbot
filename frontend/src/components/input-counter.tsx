import React from 'react'
import Input, { InputProps } from './input'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        input: {
            paddingRight: '80px'
        },
        inputPrefix: {
            paddingRight: '80px',
            paddingLeft: '40px'
        }
    })
)

export interface InputCounterProps {
    maxLength: number
    inputProps: InputProps
    prefix?: string | undefined
}

export default function InputCounter ({ maxLength, inputProps, prefix }: InputCounterProps) {
    const classes = useStyles()
    const [charCount, setCharCount] = React.useState(inputProps.value?.length)

    const onChange = (value: string) => {
        if (value.length > maxLength) return
        setCharCount(value.length)
        if (inputProps.onChange) inputProps.onChange(value)
    } 

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
        }}>
            <Input className={prefix ? classes.inputPrefix : classes.input} value={inputProps.value} onChange={onChange} style={inputProps.style}/>
            {
                prefix ? 
                <div style={{
                    position: 'absolute',
                    margin: '0',
                    left: '5px',
                    top: '0',
                    width: '40px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fb3640'
                }}>
                    <h2>{prefix}</h2>
                </div> 
                : null
            }
            <div style={{
                position: 'absolute',
                margin: '0',
                right: '0',
                top: '0',
                width: '80px',
                height: '100%',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                flexFlow: 'row-reverse'
            }}>
                <p style={{color: charCount == maxLength ? '#fb3640' : '#bbbbbb'}}>{`${charCount}/${maxLength}`}</p>
            </div>
        </div>
    )
}